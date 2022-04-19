const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userNameSearch = request.body.userName
    const moviesGenres = request.body.moviesGenresPicked
    const seriesGenres = request.body.seriesGenresPicked

    userModel.findOne({
        userName: userNameSearch
    }).then(userFound => {

        if (userFound) {
            moviesGenres.forEach(genre => {
                userFound.moviesGenres.push(genre)
            })

            seriesGenres.forEach(genre => {
                userFound.seriesGenres.push(genre)
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
        } else {
            response.status(404).json({
                message: 'User not found'
            })
        }

    }).catch(err => {

        response.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    })
    

}