const { forumModel } = require('../../models/forum')

module.exports = (request, response) => {

    const userName = request.body.userName 
    const reply = request.body.reply
    const commentId = request.body.commentId
    const elementId = request.body.elementId

    console.log(
        `userName: ${userName}, reply: ${reply}, commentId: ${commentId}`
    )

    forumModel.findOne({
        elementId: elementId
    }).then(forumExist => {

        console.log(forumExist)

        if(forumExist) {

            const newReply = {
                userName,
                comment: reply,
                date: new Date(),
                likes: 0
            }

            forumModel.findOneAndUpdate({
                elementId: elementId,
                'comments._id': commentId
            }, {
                $push: {
                    'comments.$.replies': newReply
                }
            }, {
                new: true
            }).then(forum => {

                response.status(200).json({
                    success: true,
                    forum
                })

            }).catch(error => {

                response.status(500).json({
                    success: false,
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