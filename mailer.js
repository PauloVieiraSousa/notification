const { mail } = require('sendgrid');
const Bluebird = require('bluebird')

const sg = require('sendgrid')('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');


function send(request) {
    return Bluebird.promisify(sg.API)(request)
        .then(response => {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
            return response
        });
}
function mailer({email, pass}) {
    const fromEmail = new mail.Email('rexflightscanner@gmail.com');
    const toEmail = new mail.Email(email);
    const subject = 'Sending with SendGrid is Fun';
    const content = new mail.Content('text/plain', 'and easy to do anywhere, even with Node.js');
    const mailContent = new mail.Mail(fromEmail, subject, toEmail, content);
    const request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mailContent.toJSON()
    });
    return send(request)

}
module.exports.send = mailer