const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const user = request.body.user
    const serieId = request.body.serieId
    const posterPath = request.body.posterPath
    const episodesTotal = request.body.seriesTotalEpisodes
    const seasonId = request.body.seasonId
    const seasonNumber = request.body.seasonNumber
    const episodeNumber = request.body.episodeNumber

    console.log(
        user,
        serieId,
        posterPath,
        episodesTotal,
        seasonId,
        seasonNumber,
        episodeNumber
    )

    userModel.findOne({
        userName: user.userName
    }).then(user => {

        if (user) {

            user.series.find(serie => {
                if (serie.id === serieId) {

                    serie.episodesWatched++
                    
                    serie.seasonsDetail.find(season => {
                        if (season.id === seasonId) {
                            const watched = season.episodes.find((episode, index) => { 
                                if (episode === episodeNumber) {
                                    return index
                                }
                            })

                            if (watched !== undefined) {
                                season.episodes.splice(watched, 1)
                            } else {
                                season.episodes.push( episodeNumber )
                            }

                        }
                    })

                } else {

                    const newSerie = {
                        id: serieId,
                        posterPath: posterPath,
                        episodesTotal: episodesTotal,
                        episodesWatched: 1,
                        seasonsDetail: [{
                            id: seasonId,
                            number: seasonNumber,
                            episodes: [ episodeNumber ]
                        }]
                    }

                    console.log(newSerie)

                    user.series.push(newSerie)
                }

                console.log(user.series)

                user.markModified('series')

                user.save()

                response.status(200).json({
                    message: 'Serie updated',
                    series: user.series
                })
            })

        } else {

            response.status(400).send({
                message: 'User not found'
            })

        }


    }).catch(error => {
        response.status(500).end()
    })



}