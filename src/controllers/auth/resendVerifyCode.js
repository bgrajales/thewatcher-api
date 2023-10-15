const { userModel } = require('../../models/user')
const { sendVerificationEmail } = require('./emailController');  // Asegúrate de ajustar la ruta del archivo

module.exports = async function updateUsers(request, response) {  

    const email = request.body.email

    const user = await userModel.findOne({
      email: email
    });

    if(user){
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
          response.status(200).send({
            message: "Code sent"
          })
        } else {
          console.log('Failed to send emailto ', user.userName);
          response.status(400).send({
            error: "Please try again"
          })
        }

        user.markModified('settings')
        await user.save();

    } else {
        response.status(400).send({
            error: "Please try again"
        })
    }

}
