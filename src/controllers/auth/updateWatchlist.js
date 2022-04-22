const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userName = request.body.userName
    const id = request.body.id
    const posterPath = request.body.posterPath
    const type = request.body.type

    userModel.findOne({
        userName: userName
    }).then(userFound => {

        if  ( userFound ) {

            const alreadyExists = userFound.watchlist.find(item => item.elementId === id && item.type === type)

            console.log(alreadyExists)

        } else {
            response.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }

    }).catch(err => {
        response.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    })
    
}