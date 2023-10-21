const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const { userModel } = require('../../models/user')

const returnCredentials = (user, response) => {

    const responseUser = user.toJSON()

    delete responseUser.password

    const token = jwt.sign({
        id: user._id,
        userName: user.userName,
        type: 'TOKEN'
    }, process.env.JWT_KEY, { expiresIn: '15m' })

    const refreshToken = jwt.sign({
        id: user._id,
        userName: user.userName,
        type: 'REFRESH'
    }, process.env.JWT_KEY, { expiresIn: '30d' })

    response.json({
        user: responseUser,
        token: token,
        refreshToken: refreshToken
    })
    
}

module.exports = async (request, response) => {

    console.log(request.body)

    const user = request.body
    const notifTokenToLoad = request.body.notifToken

    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .alphanum()
            .min(8)
            .max(12)
            .required(),
    })

    const validationResult = schema.validate(user)

    if (!validationResult.error) {

        userModel.findOne({
            email: user.email
        }).then(async existingUser => {

            if (existingUser) {
                const match = bcrypt.compareSync(user.password, existingUser.password)

                if (match) {
                    
                    const contains = existingUser.settings.notificationsTokens.includes(notifTokenToLoad)

                    if (!contains) {
                        existingUser.settings.notificationsTokens.unshift(notifTokenToLoad)
                        user.markModified('settings')
                        await user.save()
                    }

                    returnCredentials(existingUser, response)
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