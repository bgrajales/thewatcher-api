const { forumModel } = require('../../models/forum')

module.exports = (request, response) => {

    const userName = request.body.userName 
    const reply = request.body.reply
    const commentId = request.body.commentId

    console.log(
        `userName: ${userName}, reply: ${reply}, commentId: ${commentId}`
    )

    forumModel.findOne({
        id: commentId
    }).then(forumExist => {

        console.log(forumExist)

        if(forumExist) {

            const newReply = {
                userName,
                reply,
                date: new Date(),
                likes: 0
            }

            forumModel.findOneAndUpdate({
                id: commentId
            }, {
                $push: { 
                    replies: {
                        $each: [newReply],
                        $position: 0
                    }
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