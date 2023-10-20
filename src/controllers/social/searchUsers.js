const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userToSearch = request.body.username

    userModel.findOne({
        userName: userToSearch
    }).then(user => {

        const responseUser = user.toJSON()

        delete responseUser.password

        response.json({
            success: true,
            data: responseUser
            })
        }).catch(err => {

            response.json({
                success: false,
                data: 'User not found'
                })
        })

}