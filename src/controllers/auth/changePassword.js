const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const email = request.body.email
    const currentPassword = request.body.currentPassword
    const newPassword = request.body.newPassword

    const schema = Joi.object({
        newPassword: Joi.string()
            .alphanum()
            .min(8)
            .max(12)
            .required(),
    })

    const validationResult = schema.validate(newPassword)
    console.log(validationResult)

    if (!validationResult.error) {

        userModel.findOne({
            email: email
        }).then(existingUser => {

            if (existingUser) {
                const match = bcrypt.compareSync(user.password, currentPassword)
                console.log(match)
                if (match) {

                    user.password = bcrypt.hashSync(newPassword, 10)

                    user.markModified("password")
                    user.save()

                    response.status(200).send({
                        message: 'Password updated'
                    })
                } else {
                    response.status(400).send({
                        error: 'Invalid password'
                    })
                }
            } else {    
                response.status(400).send({
                    error: 'User with this email does not exist'
                })
            }
        })

    } else {
        response.status(400).send({
            error: validationResult.error.details[0].message
        })
    }

}