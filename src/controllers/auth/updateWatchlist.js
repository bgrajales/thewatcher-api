const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userName = request.body.userName
    const id = request.body.id
    const posterPath = request.body.posterPath
    const type = request.body.type

    userModel.findOne({
        userName: userName
    }).then(userFound => {

        const newElement = {
            elementId: id,
            posterPath: posterPath,
            type: type
        }

        const elementExists = userFound.watchlist.find(element => element.elementId === id)

        console.log(elementExists)

        if (
            elementExists !== undefined || elementExists !== null
        ) {

            console.log('element alerady exist')
            userFound.watchlist.splice(userFound.watchlist.indexOf(elementExist), 1)

            userFound.markModified('watchlist')
            console.log(userFound.watchlist)
            userFound.save().then(() => {
                response.status(200).json({
                    message: 'Removed from watchlist'
                })
            }).catch(err => {
                response.status(500).json({
                    message: 'Error removing from watchlist',
                    error: err
                })
            })
        
        } else {
            console.log('element doesnt exist')

            userFound.watchlist.push( newElement )

            userFound.markModified('watchlist')
            console.log(userFound.watchlist)

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

        }

    }).catch(err => {
        response.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    })
    
}