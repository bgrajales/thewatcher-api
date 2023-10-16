const { userModel } = require('../models/user')
const { sendVerificationEmail } = require('../controllers/auth/emailController');  // Asegúrate de ajustar la ruta del archivo
const sgMail = require('@sendgrid/mail')

module.exports = async function updateUsers() {  

    /* const user = await userModel.findOne({
      userName: "bgrajales97"
    });

    //for (const user of users) {

          const list = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
          var verifyCodeGenerated = "";
          for(var i = 0; i < 6; i++) {
              var rnd = Math.floor(Math.random() * list.length);
              verifyCodeGenerated = verifyCodeGenerated + list.charAt(rnd);
          }

          user.settings = {
            ...user.settings,
            verifyCode: verifyCodeGenerated
          }
        
          const emailSent = await sendVerificationEmail(user.email, "verifEmail", {
            verifyCode: user.settings.verifyCode
          });

          if(emailSent) {
            console.log('Email sent successfully to ', user.userName);
          } else {
            console.log('Failed to send emailto ', user.userName);
          }

          user.markModified('settings')
          await user.save();
         
      //} */
  
}
