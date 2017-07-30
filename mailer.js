const Bluebird = require('bluebird')
const nodemailer = require('nodemailer')
const ejs = require('ejs')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})
function mapFlight(flight) {
    const destinationAirport = flight.destination.airport
    const airline = flight.marketing_airline
    const departsAt = flight.departs_at
    const arrivesAt = flight.arrives_at
    const originAirport = flight.origin.airport
    return {
        destinationAirport
        , airline
        , departsAt
        , arrivesAt
        , originAirport
    }
}
function mailer(email, items) {
    const html = items.map(i => `<b>Ois<b>`).join()
    const html2 = items.map(i => {
        const total = `R$ ${i.fare.total_price}`
        const outbound = mapFlight(i.itineraries[0].outbound.flights[0])
        const inbound = mapFlight(i.itineraries[0].inbound.flights[0])
        return { outbound, inbound, total }
    })
    const result = pug.renderFile('templates/mail.pug')
    const mailOptions = {
        from: 'rexflightscanner@gmail.com',
        to: email,
        subject: 'Hello',
        text: 'Hello world ?',
        html: result
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail
            (mailOptions, (error, info) => error ? reject(error) : resolve(info))

    })
}
function renderTemplate(objs) {
    
}
renderTemplate()
module.exports.send = mailer