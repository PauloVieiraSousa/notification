require('dotenv').config()
const Every = require('every-moment')
const Mongojs = require('mongojs')
const db = Mongojs(process.env.MONGODB_URL)
const { promisify } = require('util')
const winston = require('winston')
const Bluebird = require('bluebird')
const notificationDb = Bluebird.promisifyAll(db.collection('notifications'))
const Mailer = require('./mailer')
const Sms = require('./Sms')
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

function main() {

    notificationDb
        .updateAsync(
        { 'user.name': 'Erick Wendel' },
        {
            user: {
                name: 'Erick Wendel',
                fbUser: 'erickwendel',
                email: 'rexflightscanner@gmail.com',
                phone: '5511969803385'

            },
            notification: {
                sms: true,
                email: true,
                messengerBot: false
            },
            processed: false,
            configuration: {
                maxPrice: 100.2,
                minPrice: 10.1,
                limitDate: new Date(2019, 8, 1)
            },
            insertedAt: new Date(),
            items: [
                {
                    pass: {
                        url: 'https://www.decolar.com/passagens-aereas/sao/ssa/passagens-aereas-para-salvador-saindo-de-sao+paulo?p=M1:1',
                        price: 89.1
                    }
                }
            ]

        }, { upsert: true })
        // .then(_ =>
        //     notificationDb.findAsync({}))
        .catch(error)

}
// main()
function sendSms(item) {
    return Promise.resolve(1)
    // return Sms.send(item.user.phone, item.items)
}

function sendEmail(item) {
    log(`sending email to ${item.user.email}`)
    return Mailer.send(item.user.email, item.items)
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
        log(i._id)
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
Every(1, 'second', function () {
notificationDb.findAsync({ processed: false })
    .then(runNotifications)
    .then(log)
    .catch(err => error(err))
})
