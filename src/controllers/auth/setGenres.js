const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userNameSearch = request.body.userName
    const moviesGenres = request.body.moviesGenresPicked
    const seriesGenres = request.body.seriesGenresPicked

    userModel.findOne({
        userName: userNameSearch
    }).then(userFound => {

        if (userFound) {
            userFound.moviesGenres = moviesGenres
            userFound.seriesGenres = seriesGenres

            userFound.markModified('moviesGenres')
            userFound.markModified('seriesGenres')

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


        // console.log(userFound)
        // if (userFound) {
        //     userFound.moviesGenres = moviesGenres
        //     userFound.seriesGenres = seriesGenres

        //     user.markModified('moviesGenres')
        //     user.markModified('seriesGenres')

        //     console.log(userFound)

        //     userFound.save().then(() => {
        //         response.status(200).json({
        //             success: true,
        //             message: 'Genres updated successfully'
        //         })
        //     }).catch(err => {
        //         response.status(500).json({
        //             success: false,
        //             message: 'Something went wrong'
        //         })
        //     })
        // } else {

        //     response.status(404).json({
        //         success: false,
        //         message: 'User not found'
        //     })
        // }

    }).catch(err => {

        response.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    })
    

}