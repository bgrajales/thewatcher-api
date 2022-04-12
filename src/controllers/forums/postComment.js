const { forumModel } = require('../../models/forum')

module.exports = (request, response) => {

    const userName = request.body.userName 
    const comment = request.body.comment
    const elementId = request.body.elementId
    const type = request.body.type

    forumModel.findOne({
        elementId: elementId
    }).then(forumExist => {

        if(forumExist) {

            const newComment = {
                userName,
                comment,
                date: new Date(),
                likes: 0,
                replies: []
            }

            forumModel.findOneAndUpdate({
                elementId: elementId
            }, {
                $push: { comments: newComment, $position: 0 },
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

            const newForum = {
                type: type,
                elementId: elementId,
                comments: [{
                    userName: userName,
                    comment: comment,
                    date: new Date(),
                    likes: 0,
                    replies: []
                }]
            }

            forumModel.create(newForum).then(forum => {
                    
                    response.status(200).json({
                        success: true,
                        forum
                    })
    
                }).catch(error => {
                                            
                        response.status(500).json({
                            success: false,
                            error
                        })
        
                    } 
                )

        }

    })

}