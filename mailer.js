const Bluebird = require('bluebird')
const nodemailer = require('nodemailer')
const pug = require('pug')
const moment = require('moment')
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
        const price = `R$ ${i.fare.total_price.toString().replace('.', ',')}`
        const outbound = mapFlight(i.itineraries[0].outbound.flights[0])
        const inbound = mapFlight(i.itineraries[0].inbound.flights[0])
        const out1 = {
            destiny: `${outbound.originAirport} - ${outbound.destinationAirport}`,
            airline: outbound.airline,
            price: price, 
            boarding: moment(outbound.departsAt, 'YYYY-MM-DDThh:mm:ssZ').format('DD/MM/YY - hh:mm') + ' hrs'
        }
        const in1 = {
            destiny: `${inbound.originAirport} - ${inbound.destinationAirport}`,
            airline: inbound.airline,
            price: price, 
            boarding: moment(inbound.departsAt, 'YYYY-MM-DDThh:mm:ssZ').format('DD/MM/YY - hh:mm') + ' hrs'
        }
        return { inbound: in1, outbound: out1 }

    })
    let mappedItems = []
    for (var i = 0; i < html2.length; i++) {
        mappedItems[i] = html2[i].outbound
        mappedItems[i + 1] = html2[i].inbound
    }

    const fs = require('fs')
    const headerImage = fs.readFileSync('templates/images/header.jpg')
    const sidebarImage = fs.readFileSync('templates/images/ida-volta.jpg')
    var headerEncodedImage = new Buffer(headerImage, 'binary').toString('base64')
    var sidebarEncodedImage = new Buffer(sidebarImage, 'binary').toString('base64')
    const result = pug.renderFile('templates/mail.pug', {
        header: `data:image/png;base64,${headerEncodedImage}`,
        sidebar: `data:image/png;base64,${sidebarEncodedImage}`,
        tickers: mappedItems
        // [
        //   { destiny: 'GRU - SLZ', price: 'R$ 343,00', boarding: '07h45' },
        //   { destiny: 'GRU - SLZ', price: 'R$ 343,00', boarding: '07h45' },
        //   { destiny: 'GRU - SLZ', price: 'R$ 343,00', boarding: '07h45' },
        //   { destiny: 'GRU - SLZ', price: 'R$ 343,00', boarding: '07h45' },
        //   { destiny: 'GRU - SLZ', price: 'R$ 343,00', boarding: '07h45' },
        //   { destiny: 'GRU - SLZ', price: 'R$ 343,00', boarding: '07h45' }
        // ]
    })
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
