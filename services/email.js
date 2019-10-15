const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const sendgridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIKey);


const verifiedEmail = (email, name, token, role) => {
  if (role === 'musician') {
    return sgMail.send({
      to: email,
      from: 'admin@museek.com',
      subject: 'Thanks for sign up!',
      text: `Please fill another information on your app, so we will verify your account`
    });
  }
  return sgMail.send({
    to: email,
    from: 'admin@museek.com',
    subject: 'Thanks for sign up!',
    text: `Click button down below to verify your account`
  });
};

module.exports = {
  verifiedEmail
};

