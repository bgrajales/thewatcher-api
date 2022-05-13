const { forumModel } = require('../../models/forum')

module.exports = (request, response) => {

    const userName = request.body.userName 
    const reply = request.body.reply
    const commentId = request.body.commentId
    const elementId = request.body.elementId

    forumModel.findOne({
        elementId: elementId
    }).then(forumExist => {

        if(forumExist) {

            const date = new Date()

            const day = date.getDate()
            const month = date.getMonth() + 1
            const year = date.getFullYear()

            const newReply = {
                userName,
                comment: reply,
                date: `${day}/${month}/${year}`,
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