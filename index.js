const Every = require('every-moment')
const Mongojs = require('mongojs')
const db = Mongojs('mongodb://rexflightscanner:rex123@ds129003.mlab.com:29003/rexscanner')
const { promisify } = require('util')
const winston = require('winston')
const Bluebird = require('bluebird')
const notificationDb = Bluebird.promisifyAll(db.collection('notifications'))
const Mailer = require('./mailer')
const logger = new winston.Logger({
    level: 'info',
    transports: [
        new (winston.transports.Console)()
    ]

})
const stringify = (item) => typeof (item) == 'object' ? JSON.stringify(item) : item
const templateLog = (msg, params) => `${stringify(msg) || ''} ${params ? ',' : ''}${stringify(params) || ''}`
const log = (msg, params) => logger.log('info', templateLog(msg, params))
const error = (msg, params) => logger.log('error', templateLog(msg, params))

db.on('connect', () => log('database connected'))
db.on('error', (err) => error('database error', err))



function main() {

    notificationDb
        .updateAsync(
        { 'user.name': 'Erick Wendel' },
        {
            user: {
                name: 'Erick Wendel',
                fbUser: 'erickwendel',
                email: 'erick.workspace@gmail.com',
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
                limitDate: new Date(2019, 08, 01)
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
main()
function sendSms(items) {
    return Promise.resolve(1)
}

function sendEmail(items) {
    return items.map(i => Mailer.send(i))
}

function sendBotMessage(items) {
    return Promise.resolve(1)

}

function sendNotifications(items) {
    const notifiers = {
        sms: sendSms,
        email: sendEmail,
        messengerBot: sendBotMessage
    }
    const results = items
        .map(item => {
            const notification = item.notification
            const functions = Object.keys(notification).filter(i => notification[i])

            const notifications = Object.keys(functions)
                .map(i => notifiers[functions[i]](items))

            return notifications
        })
    .reduce((prev, next) => prev.concat(next), [])

    return {items, results: Promise.all(results)}
}



function updateNotifications(items) {
    return Promise.resolve(1)
}
notificationDb.findAsync({ processed: false })
    // .then(sendNotifications)
    .then(result => updateNotifications(result.items))
    .then(log)
    .catch(err => {throw Error(err)})
// Every(1, 'second', function () {

//     notificationDb.findAsync({ processed: false })
//         .then(sendNotifications)
//         .then(items => updateNotifications(items))
//         .catch(error)


// })
