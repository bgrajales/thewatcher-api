// Archivo: emailController.js

const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// point to the template folder
const handlebarOptions = {
  viewEngine: {
      partialsDir: path.resolve('./src/utils/'),
      defaultLayout: false,
  },
  viewPath: path.resolve('./src/utils/'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions));

async function sendVerificationEmail(user) {
  try {
    const info = await transporter.sendMail({
      from: 'appthewatcher@gmail.com', // sender address
      template: "verifEmail",
      to: user.email, // list of receivers
      subject: 'The Watcher App | Verification Code', // Subject
      context: {
        verifyCode: user.settings.verifyCode,
      }
    });
    return true;
  } catch (error) { 
    return false;
  }
}

module.exports = {
  sendVerificationEmail
};
