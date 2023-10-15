const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const { userModel } = require('../../models/user')
const { sendVerificationEmail } = require('../controllers/auth/emailController');

module.exports = (request, response) => {

    const user = request.body
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
                            error: 'Username already taken'
                        })
                    } else {

                        user.password = bcrypt.hashSync(user.password, 10)

                        const list = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
                        var verifyCodeGenerated = "";
                        for(var i = 0; i < 6; i++) {
                            var rnd = Math.floor(Math.random() * list.length);
                            verifyCodeGenerated = verifyCodeGenerated + list.charAt(rnd);
                        }

                        userModel.create({
                            userName: user.userName,
                            email: user.email,
                            password: user.password,
                            region: user.region,
                            seriesGenres: [],
                            moviesGenres: [],
                            series: [],
                            movies: [],
                            likedComments: [],
                            settings:{
                                leng: "en-US",
                                verifyCode: verifyCodeGenerated,
                                newAccount: true,
                                dateCreated: Date.now(),
                            }
                        }).then(async createdUser => {

                            const userResponse = createdUser.toJSON()

                            delete userResponse.password

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

                            const emailSent = await sendVerificationEmail(user);
                            if(emailSent) {
                                console.log('Email sent successfully');
                            } else {
                                console.log('Failed to send email');
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
            }

        }).catch(err => {
            response.status(500).send({
                error: err.message
            })
        })

    } else {

        if (validationResult.error.details[0].message.includes('repeatPassword')) {
            response.status(400).send({
                error: 'Passwords do not match'
            })
        } else if (validationResult.error.details[0].message.includes('region')) {
            response.status(400).send({
                error: 'Region is required'
            })
        } else if (validationResult.error.details[0].message.includes('userName')) {
            response.status(400).send({
                error: 'Username does not meet requirements'
            })
        } else if (validationResult.error.details[0].message.includes('email')) {
            response.status(400).send({
                error: 'Email is not valid'
            })
        } else if (validationResult.error.details[0].message.includes('password')) {
            response.status(400).send({
                error: 'Password does not meet requirements'
            })
        } else {
            response.status(400).send({
                error: 'Invalid data'
            })
        }

    }

}