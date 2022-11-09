const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const username = request.body.username
    const newLeng = request.body.newLeng
    
    userModel.findOne({
        userName: username
    }).then(user => {

        if (user) {
            user.settings = {
                ...user.settings,
                leng: newLeng
            }

            user.markModified('settings')
            user.save()

            return response.status(200).send({ message: 'Lenguage changed' })
        } else {
            return response.status(404).send({ message: 'User not found' })
        }

    })

}