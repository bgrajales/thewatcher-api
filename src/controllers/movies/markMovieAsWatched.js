const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const user = request.body.user
    const movie = request.body.movie

    userModel.findOne({
        userName: user.userName
    }).then(user => {

        user.movies.push({
            id: movie.id,
            posterPath: movie.posterPath,
            runTime: movie.runTime,
            dateAdded: Date.now()
        })

        user.markModified('movies')

        user.save()
        
        response.status(200).json({
            message: 'Movie marked as watched',
            movies: user.movies
        })

    }).catch(error => {
        response.status(500).end()
    })



}