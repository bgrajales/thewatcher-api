const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const requestUserName = request.body.userName 
    const commentId = request.body.commentId

    console.log(requestUserName, commentId)

    userModel.findOne({
        userName: requestUserName
    }).then(userExist => {

        if(userExist) {

            if(userExist.likedComments.includes(commentId)) {
                userExist.likedComments.splice(userExist.likedComments.indexOf(commentId), 1)
            } else {
                userExist.likedComments.push(commentId)
            }
            
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