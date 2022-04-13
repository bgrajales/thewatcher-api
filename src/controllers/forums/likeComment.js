const { userModel } = require('../../models/user')
const { forumModel } = require('../../models/forum')

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

            forumModel.findOne({
                _id: commentId
            }).then(commentExist => {

                if(commentExist) {

                    console.log(commentExist)
                    if(action === 'like') {
                        commentExist.likes += 1
                    } else {
                        commentExist.likes -= 1
                    }

                    commentExist.markModified('likes')
                    commentExist.save()

                    response.status(200).json({
                        success: true,
                        action: action
                    })

                } else {
                    response.status(200).json({
                        success: false,
                        message: 'Comment not found'
                    })
                }

            })

        } else {

            response.status(200).json({
                success: false,
                user: null
            })           

        }

    })

}