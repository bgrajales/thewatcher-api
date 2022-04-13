const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const requestUserName = request.body.userName 
    const commentId = request.body.commentId

    console.log(requestUserName, commentId)

    userModel.findOne({
        userName: requestUserName
    }).then(userExist => {

        if(userExist) {

            let action

            if(userExist.likedComments.includes(commentId)) {
                userExist.likedComments.splice(userExist.likedComments.indexOf(commentId), 1)
                action = 'unlike'
            } else {
                userExist.likedComments.push(commentId)
                action = 'like'
            }
            
            userExist.markModified('likedComments')
            userExist.save()
            response.status(200).json({
                success: true,
                action: action
            })

        } else {

            response.status(200).json({
                success: false,
                user: null
            })           

        }

    })

}