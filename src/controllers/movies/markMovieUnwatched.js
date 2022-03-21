const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const user = request.body.user
    const movieId = request.body.movieId

    userModel.findOne({
        userName: user.userName
    }).then(user => {

        const newArray = user.movies.filter(movie => parseInt(movie.id) !== parseInt(movieId))

        user.movies = newArray

        user.markModified('movies')

        user.save()
        
        response.status(200).json({
            message: 'Movie marked as not watched',
            movies: user.movies
        })

    }).catch(error => {
        response.status(500).end()
    })



}