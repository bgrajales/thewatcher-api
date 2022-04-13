const { userModel } = require('../../models/forum')

module.exports = (request, response) => {

    const userName = request.body.userName 
    const commentId = request.body.commentId

    userModel.findOne({
        userName: userName
    }).then(userExist => {

        if(userExist) {

            userExist.likedComments.push(commentId)

            userExist.markModified('likedComments')
            userExist.save()

            response.status(200).json({
                success: true,
                user: userExist
            })

        } else {

            response.status(200).json({
                success: false,
                user: null
            })           

        }

    })

}