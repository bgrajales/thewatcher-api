const { forumModel } = require('../../models/forum')

module.exports = (request, response) => {

    const userName = request.body.userName 
    const reply = request.body.reply
    const commentId = request.body.commentId

    forumModel.findOne({
        _id: commentId
    }).then(forumExist => {

        if(forumExist) {

            const newReply = {
                userName,
                reply,
                date: new Date(),
                likes: 0
            }

            forumExist.replies.push(newReply)

            forumExist.markModified('replies')

            forumExist.save().then(forum => {
                response.status(200).json({
                    message: 'Reply added successfully',
                    forum
                })
            }).catch(error => {
                response.status(500).json({
                    message: 'Error adding reply',
                    error
                })
            })

        } else {

            response.status(404).json({
                success: false,
                error: 'Forum not found'
            })

        }

    }).catch(error => {

        response.status(500).json({
            success: false,
            error
        })

    })
    

}