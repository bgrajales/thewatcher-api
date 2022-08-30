const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userToSearch = request.body.user

    if (!userToSearch) {
        response.status(401).send({
            message: 'User not found'
            })
    } else {
        userModel.findOne({
            where: {
                userName: userToSearch
            }
        }).then(user => {
            if (!user) {
                response.status(401).send({
                    message: 'User not found'
                })
            } else {
                response.status(200).send({
                user: user.userName
                })
            }
        })

    }

}