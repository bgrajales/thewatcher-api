const { userModel } = require('../../models/forum')

module.exports = (request, response) => {

    const requestUserName = request.body.userName 
    const commentId = request.body.commentId

    console.log(userName, commentId)

    userModel.findOne({
        userName: requestUserName
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