const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const verifyCode = request.body.verifyCode
    const username = request.body.username
    
    userModel.findOne({
        userName: username
    }).then(user => {

        if (user) {
            if (user.settings.verifyCode == verifyCode) {
                console.log("Email confirmado")
                user.settings = {
                    ...user.settings,
                    verifyCode: "verified"
                }

                user.markModified('settings')
                user.save().catch(error => {
                    console.error('Error saving user:', error);
                });
    
                return response.status(200).send({ message: 'Email Verified' })
            } else {
                return response.status(406).send({ message: 'Codes dont match' })
            }
        } else {
            return response.status(404).send({ message: 'User not found' })
        }

    })
}