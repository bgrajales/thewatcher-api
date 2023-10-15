const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const verifyCode = request.body.verifyCode
    const username = request.body.username
    
    userModel.findOne({
        userName: username
    }).then(user => {

        if (user) {
            if (user.verifyCode == verifyCode) {
                console.log("Email confirmado")
                user.verifyCode = "verified"

                user.markModified('settings')
                user.save()
    
                return response.status(200).send({ message: 'Email Verified' })
            } else {
                return response.status(406).send({ message: 'Codes dont match' })
            }
        } else {
            return response.status(404).send({ message: 'User not found' })
        }

    })
}