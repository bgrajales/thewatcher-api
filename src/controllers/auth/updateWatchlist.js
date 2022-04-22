const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userName = request.body.userName
    const id = request.body.id
    const posterPath = request.body.posterPath
    const type = request.body.type

    userModel.findOne({
        userName: userName
    }).then(userFound => {

        userFound.watchlist.push({
            id: id,
            posterPath: posterPath,
            type: type
        })

        userFound.markModified('watchlist')

        userFound.save().then(() => {
            response.status(200).json({
                message: 'Movie/Series added successfully'
            })
        }).catch(err => {
            response.status(500).json({
                message: 'Error adding movie/series',
                error: err
            })
        })

    }).catch(err => {
        response.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    })
    
}