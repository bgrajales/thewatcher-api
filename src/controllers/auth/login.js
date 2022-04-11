const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const { userModel } = require('../../models/user')

const returnCredentials = (user, response) => {

    const responseUser = user.toJSON()

    delete responseUser.password
    delete responseUser.series
    delete responseUser.movies

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

    console.log(
        'token: ', token,
        'refreshToken: ', refreshToken,
        'user: ', responseUser
    )
    
    response.json({
        user: responseUser,
        token: token,
        refreshToken: refreshToken
    })
    
}

module.exports = (request, response) => {

    const user = request.body

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

    console.log(validationResult)

    if (!validationResult.error) {

        userModel.findOne({
            email: user.email
        }).then(existingUser => {

            if (existingUser) {
                console.log(existingUser.userName)
                const match = bcrypt.compareSync(user.password, existingUser.password)

                if (match) {
                    console.log('match')
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