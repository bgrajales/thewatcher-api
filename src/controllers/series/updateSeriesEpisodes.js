const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userName = request.body.user
    const series = request.body.series

    console.log(userName)
    console.log(series)

    userModel.findOne({
        userName: userName
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