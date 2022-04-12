const { forumModel } = require('../../models/forum')

module.exports = (request, response) => {

    const forumData = request.body.forumData

    forumModel.findOne({
        elementId: forumData.elementId
    }).then(forumExist => {

        if(forumExist) {

            const comment = {
                userName: forumData.userName,
                comment: forumData.comment,
                date: new Date(),
                likes: 0,
                replies: []
            }

            forumModel.findOneAndUpdate({
                elementId: forumData.elementId
            }, {
                $push: {
                    comments: comment
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

            const newForum = {
                type: forumData.type,
                elementId: forumData.elementId,
                comments: [{
                    userName: forumData.userName,
                    comment: forumData.comment,
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