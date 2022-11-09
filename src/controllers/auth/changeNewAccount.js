const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const username = request.body.username
    
    userModel.findOne({
        userName: username
    }).then(user => {

        if (user) {
            user.settings = {
                ...user.settings,
                newAccount: false
            }

            user.markModified('settings')
            user.save()

            return response.status(200).send({ message: 'User changed' })
        } else {
            return response.status(404).send({ message: 'User not found' })
        }

    })
}