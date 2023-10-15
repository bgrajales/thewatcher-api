const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const { userModel } = require('../../models/user')
const { sendVerificationEmail } = require('./emailController');


module.exports = async (request, response) => {

    const email = request.body.email

    const user = await userModel.findOne({ email: email });

    if (user) {

        const list = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789abcdefghijklmnpqrstuvwxyz";
        var passwordGenerated = "";
        for(var i = 0; i < 9; i++) {
            var rnd = Math.floor(Math.random() * list.length);
            passwordGenerated = passwordGenerated + list.charAt(rnd);
        }
        user.password = bcrypt.hashSync(passwordGenerated, 10)

        const emailSent = await sendVerificationEmail(user.email, "passwordEmail", {
            newPassword: passwordGenerated
        });

        if(emailSent) {
        console.log('Email sent successfully to ', user.userName);
        } else {
        console.log('Failed to send emailto ', user.userName);
        }

    } else {
        response.status(400).send({
            error: "No user found"
        })
    }

}