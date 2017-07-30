require('dotenv').config()
const Mongojs = require('mongojs')
const db = Mongojs(process.env.MONGODB_URL)
const Bluebird = require('bluebird')
const notificationDb = Bluebird.promisifyAll(db.collection('notifications'))

db.on('connect', () => console.log('database connected'))
db.on('error', (err) => console.error('database error', err))



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

    },
    { upsert: true })
    .then(_ =>
        notificationDb.findAsync({}))
    .then(console.log)
    .then(_ => process.exit())
    .catch(console.error)

