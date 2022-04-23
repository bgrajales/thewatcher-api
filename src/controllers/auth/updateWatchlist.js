const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userName = request.body.userName
    const id = request.body.id
    const posterPath = request.body.posterPath
    const type = request.body.type

    userModel.findOne({
        userName: userName
    }).then(userFound => {

        if  ( userFound ) {

            // check if user watchlist already has this element

            let watchlist = userFound.watchlist

            let watchlistElement = watchlist.find(element => {
                return element.elementId === id && element.type === type
            })

            if ( watchlistElement ) {
                console.log('Element already on watchlist')
                response.status(200).json({
                    message: 'Element already in watchlist'
                })

            } else {
                console.log('element added')
                userFound.watchlist.push({
                    elementId: id,
                    posterPath: posterPath,
                    type: type
                })

                userFound.markModified('watchlist')

                userFound.save().then(() => {
                    response.status(200).json({
                        message: 'Element added to watchlist'
                    })
                }).catch(err => {
                    response.status(500).json({
                        message: 'Error adding element to watchlist',
                        error: err
                    })
                })

            }

        } else {
            response.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }

    }).catch(err => {
        response.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    })
    
}