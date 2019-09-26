const sgMail = require('@sendgrid/mail')
require('dotenv').config()

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)


const verifiedEmail = (email, name, token) => {
  sgMail.send({
    to: email,
    from: 'admin@museek.com',
    subject: 'Thanks for sign up!',
    text: `Welcome to the app, ${name}. Let us know how you get along with the app token ${token}.`
  })
}

module.exports = {
  verifiedEmail
}

