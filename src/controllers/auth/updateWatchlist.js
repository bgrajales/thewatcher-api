const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userName = request.body.userName
    const id = request.body.id
    const posterPath = request.body.posterPath
    const type = request.body.type
    const action = request.body.action

    userModel.findOne({
        userName: userName
    }).then(userFound => {

        if (action === 'add') {

            userFound.watchlist.push({
                elementId: id,
                posterPath: posterPath,
                type: type
            })

            userFound.markModified('watchlist')

            userFound.save().then(() => {
                response.status(200).json({
                    message: 'Added to watchlist',
                    watchlist: userFound.watchlist
                })
            }).catch(err => {
                response.status(500).json({
                    message: 'Error adding to watchlist',
                    error: err
                })
            })

        } else if (action === 'remove') {

            const newArray = userFound.watchlist.filter(item => item.elementId.toString() !== id.toString());

            userFound.watchlist = newArray

            userFound.markModified('watchlist')

            userFound.save().then(() => {
                response.status(200).json({
                    message: 'Removed from watchlist',
                    watchlist: userFound.watchlist
                })
            }).catch(err => {
                response.status(500).json({
                    message: 'Error removing from watchlist',
                    error: err
                })
            })

        }

    }).catch(err => {
        response.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    })
    
}