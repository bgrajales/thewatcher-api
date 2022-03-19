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

        markModified(user, 'movies')

        user.save().then(() => {
            response.status(200).end()
        }).catch(error => {
            response.status(500).end()
        })

    }).catch(error => {
        response.status(500).end()
    })



}