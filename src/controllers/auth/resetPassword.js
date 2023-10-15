const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const { userModel } = require('../../models/user')
const { sendVerificationEmail } = require('./emailController');


module.exports = async (request, response) => {

    const email = request.body.email
    console.log(email)

    const user = userModel.findOne({email: email})

    if (user) {

        const list = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789abcdefghijklmnpqrstuvwxyz";
        var passwordGenerated = "";
        for(var i = 0; i < 9; i++) {
            var rnd = Math.floor(Math.random() * list.length);
            passwordGenerated = passwordGenerated + list.charAt(rnd);
        }
        console.log(passwordGenerated)
        user.password = bcrypt.hashSync(passwordGenerated, 10)

        try {
            await sendVerificationEmail(user, "passwordEmail", {
                newPassword: passwordGenerated
            });
        } catch (error) {
            console.log(error)
        }

    } else {
        response.status(400).send({
            error: "No user found"
        })
    }

}