const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userNameSearch = request.body.userName
    const moviesGenres = request.body.moviesGenresPicked
    const seriesGenres = request.body.seriesGenresPicked

    userModel.findOne({
        userName: userNameSearch
    }).then(userFound => {
        
            console.log(moviesGenres, seriesGenres)
            console.log(userFound)

            moviesGenres.forEach(item => {
                userFound.moviesGenres.push({
                    genreId: item.id,
                    genre: item.genre
                })
            })

            seriesGenres.forEach(item => {
                userFound.seriesGenres.push({
                    genreId: item.id,
                    genre: item.genre
                })
            })

            userFound.markModified('moviesGenres')
            userFound.markModified('seriesGenres')

            console.log(userFound.moviesGenres, userFound.seriesGenres)

            userFound.save().then(() => {
                response.status(200).json({
                    message: 'Genres updated successfully'
                })
            }).catch(err => {
                response.status(500).json({
                    message: 'Error updating genres',
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