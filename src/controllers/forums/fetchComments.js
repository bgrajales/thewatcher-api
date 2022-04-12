const { forumModel } = require('../../models/forum')

module.exports = (request, response) => {

    const elementId = request.params.elementId
    
    console.log(elementId)

    forumModel.findOne({
        elementId: elementId
    }).then(forumExist => {

        if(forumExist) {

            console.log(forumExist)
            response.status(200).json({
                success: true,
                forum: forumExist
            })

        } else {

            response.status(200).json({
                success: false,
                forum: null
            })           

        }

    })

}