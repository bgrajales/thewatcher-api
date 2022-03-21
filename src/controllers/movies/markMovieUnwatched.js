const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    console.log(request.body)
    const user = request.body.user
    const movieId = request.body.movieId

    userModel.findOne({
        userName: user.userName
    }).then(user => {

        user.movies = user.movies.filter(movie => movie.id !== movieId)

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