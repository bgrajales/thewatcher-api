const { userModel } = require('../../models/user')
const { forumModel } = require('../../models/forum')

module.exports = (request, response) => {

    const requestUserName = request.body.userName 
    const commentId = request.body.commentId
    const forumId = request.body.stringElementId

    console.log(requestUserName, commentId, stringElementId)

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
                _id: forumId
            }).then(forumExist => {

                if(forumExist) {

                    forumExist.comments.forEach(comment => {
                        if(comment._id == commentId) {
                            if(action == 'like') {
                                comment.likes++
                            } else {
                                comment.likes--
                            }
                        }
                    })

                    forumExist.markModified('comments')
                    forumExist.save()

                    response.status(200).json({
                        success: true,
                        action: action
                    })

                } else {
                    response.status(200).json({
                        success: false,
                        message: 'Forum not found'
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