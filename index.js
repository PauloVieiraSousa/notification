require('dotenv').config()
const Every = require('every-moment')
const Mongojs = require('mongojs')
const db = Mongojs(process.env.MONGODB_URL)
const { promisify } = require('util')
const winston = require('winston')
const Bluebird = require('bluebird')
const notificationDb = Bluebird.promisifyAll(db.collection('notifications'))
const Mailer = require('./mailer')
// const Sms = require('./Sms')
const logger = new winston.Logger({
    level: 'info',
    transports: [
        new (winston.transports.Console)()
    ]

})
const stringify = (item) => typeof (item) == 'object' ? JSON.stringify(item) : item
const templateLog = (msg, params) => `${stringify(msg) || ''} ${params ? ',' : ''}${stringify(params) || ''}`
global.log = (msg, params) => logger.log('info', templateLog(msg, params))
global.error = (msg, params) => logger.log('error', msg, `${params ? ',' : ''}${params || ''}`)

db.on('connect', () => log('database connected'))
db.on('error', (err) => error('database error', err))
const NOTIFIERS = {
    sms: sendSms,
    email: sendEmail,
    messengerBot: sendBotMessage
}

function sendSms(item) {
    return Promise.resolve(1)
    // return Sms.send(item.user.phone, item.items)
}
function timeout() {
    return new Promise(resolve => setTimeout(() => resolve(), 1000))
}
function sendEmail(item) {

    return timeout().then(_ => {
        log(`sending email to ${item.user.email}`)
        Mailer.send(item.user.email, item.items)
    })
}

function sendBotMessage(items) {
    return Promise.resolve(1)

}

function sendNotifications(items) {

    const results = items
        .map(item => {

            const notification = item.notification
            const functions = Object.keys(notification).filter(i => notification[i])

            const notifications = Object.keys(functions)
                .map(i => NOTIFIERS[functions[i]](item))

            return notifications
        })
        .reduce((prev, next) => prev.concat(next), [])

    return Promise.resolve({ items, results: Promise.all(results) })
}


function updateNotifications(items) {
    log(`updating notifications`)
    const results = items.map(i => {
        return notificationDb.updateAsync({ _id: i._id }, { $set: { processed: true } })
    })

    return Promise.all(results)
}

function runNotifications(results) {
    if (results.length === 0) return []

    log(`processing... ${results.length}`)
    return sendNotifications(results)
        .then(result => updateNotifications(result.items))

}

Every(10, 'seconds', function () {
    notificationDb.findAsync({ processed: false, items: { $ne: null } })
        .then(runNotifications)
        .then(log)
        .catch(err => error(err))
})
