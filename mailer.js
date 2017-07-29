const Bluebird = require('bluebird')
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

function mailer(email, items) {
    const html = items.map(i => `<b>URL:</b> ${i.pass.url} <br>
                                  <b>PRICE</b>: R$ ${i.pass.price} 
                                  <br><br>`).join()
    const mailOptions = {
        from: 'rexflightscanner@gmail.com', 
        to: email, 
        subject: 'Hello', 
        text: 'Hello world ?', 
        html: html
    };
    
    return new Promise((resolve, reject) => {
        transporter.sendMail
            (mailOptions, (error, info) => error ? reject(error) : resolve(info));
    })
}

module.exports.send = mailer