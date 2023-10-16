// Archivo: emailController.js
const sgMail = require('@sendgrid/mail')

async function sendVerificationEmail(email, typeOfEmail, context){

  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  
  let templateId

  switch (typeOfEmail) {
    case "verifEmail":
      templateId = 'd-5c5703a74fd640b0a6357f9cd9386499'
      break;
    case "passwordEmail":
      templateId = 'd-acecf48d6cc94a39a47640e6a8e23e2b'
      break;
    default:
      break;
  }
  
  console.log(templateId, email, context)

  const msg = {
    to: email,
    from: 'support@thewatcherapp.com',
    fromname: 'The Watcher App',
    template_id: templateId,
    dynamic_template_data: context
  }

  try {
    await sgMail.send(msg);
    console.log('Email sent');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }

}

module.exports = {
  sendVerificationEmail
};
