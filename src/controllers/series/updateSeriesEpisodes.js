const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const user = request.body.user
    const series = request.body.series

    userModel.findOne({
        userName: user.userName
    }).then(user => {

        if (user) {

            user.series = series            

            user.markModified('series')

            user.save()

            response.status(200).json({
                message: 'Serie updated',
                series: user.series
            })

        } else {

            response.status(400).send({
                message: 'User not found'
            })

        }


    }).catch(error => {
        response.status(500).end()
    })



}