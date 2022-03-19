const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const user = request.body
    console.log(user)
    const schema = Joi.object({
        userName: Joi.string()
            .regex(/^[a-zA-Z0-9]+$/)
            .min(5)
            .max(12)
            .required(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .alphanum()
            .min(8)
            .max(12)
            .required(),
        repeatPassword: Joi.ref('password'),
        region: Joi.string()
            .required()
    })

    const validationResult = schema.validate(user)

    console.log(validationResult)

    if (!validationResult.error) {

        userModel.findOne({ 
            email: user.email, 
        }).then(existingUser => {

            if ( existingUser ) {
                return response.status(400).send({
                    error: 'User with this email already exists'
                })
            } else {

                userModel.findOne({
                    userName: user.userName
                }).then(existingUser => {

                    if ( existingUser ) {
                        return response.status(400).send({
                            error: 'User with this userName already exists'
                        })
                    } else {

                        console.log('doesnt exist')
                        user.password = bcrypt.hashSync(user.password, 10)

                        userModel.create({
                            userName: user.userName,
                            email: user.email,
                            password: user.password,
                            region: user.region
                        }).then(createdUser => {

                            const userResponse = createdUser.toJSON()

                            delete userResponse.password
                            delete userResponse.series
                            delete userResponse.movies

                            const token = jwt.sign({
                                id: userResponse._id,
                                userName: userResponse.userName,
                                type: 'TOKEN'
                            }, process.env.JWT_KEY, { expiresIn: '1h' })

                            const refreshToken = jwt.sign({
                                id: userResponse._id,
                                userName: userResponse.userName,
                                type: 'REFRESH'
                            }, process.env.JWT_KEY,{ expiresIn: '30d' })

                            response.status(200).send({
                                user: userResponse,
                                token,
                                refreshToken
                            })

                        }).catch(err => {
                            response.status(500).send({
                                error: err.message
                            })
                        })
                        
                    }
                
                }).catch(err => {
                    response.status(500).send({
                        error: err.message
                    })
                })
            }

        }).catch(err => {
            response.status(500).send({
                error: err.message
            })
        })

    } else {
        response.status(400).send({
            error: validationResult.error.details[0].message
        })
    }

}