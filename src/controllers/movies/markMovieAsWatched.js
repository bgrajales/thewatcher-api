const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    console.log(request.body)
    const user = request.body.user
    const movie = request.body.movie

    console.log(user, movie)
    userModel.findOne({
        userName: user.userName
    }).then(user => {

        console.log(user)
        user.movies.push({
            id: movie.id,
            posterPath: movie.posterPath,
            runTime: movie.runTime
        })

        console.log(user.movies)

        user.markModified('movies')

        user.save()
        
        response.status(200).json({
            message: 'Movie marked as watched',
            movies: user.movies
        })

        console.log(user)

    }).catch(error => {
        response.status(500).end()
    })



}