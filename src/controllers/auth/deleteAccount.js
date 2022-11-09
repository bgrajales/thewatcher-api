const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userName = request.body.userName

    userModel.findOneAndDelete({
        userName: userName
    }).then(user => {
    
        if (user) {
            response.status(200).json({
                message: 'User deleted'
            })
        } else {
            response.status(404).json({
                message: 'User not found'
            })
        }
    }).catch(error => {
        response.status(500).json({
            message: 'Internal server error'
        })
    })
    
}