const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userToSearch = request.body.username

    userModel.findOne({
        userName: userToSearch
    }).then(user => {

        response.json({
            success: true,
            data: user.userName
            })
        }).catch(err => {

            response.json({
                success: false,
                data: 'User not found'
                })
        })

}