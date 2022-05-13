const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const user = request.body.userName
    const serieId = request.body.id
    const posterPath = request.body.posterPath
    const action = request.body.action
    const serieTotalEpisodes = request.body.serieTotalEpisodes
    const seriesSeasons = request.body.seriesSeasons

    userModel.findOne({
        userName: user
    }).then( user => {

        if(user) {
            if(action === 'add') {
                
                let exists = false

                user.series.forEach(serie => {
                    if(serie.id === serieId) {
                        exists = true
                    }
                })

                if(!exists) {

                    const newSeasonsDetail = []

                    seriesSeasons.forEach(season => {
                        const episodesArr = []

                        for (let index = 1; index < season.episode_count; index++) {
                            episodesArr.push({
                                index
                            })                           
                        }

                        const newSeasonDetailElement = {
                            id: season.id,
                            number: season.season_number,
                            episodes: episodesArr
                        }

                        newSeasonsDetail.push(newSeasonDetailElement)
                    })

                    const newSerie = {
                        id: serieId,
                        posterPath: posterPath,
                        episodesTotal: serieTotalEpisodes,
                        episodesWatched: serieTotalEpisodes,
                        seasonsDetail: newSeasonsDetail,
                    }
                } else {
                    const newSeasonsDetail = []

                    seriesSeasons.forEach(season => {
                        const episodesArr = []

                        for (let index = 1; index < season.episode_count; index++) {
                            episodesArr.push({
                                index
                            })                           
                        }

                        const newSeasonDetailElement = {
                            id: season.id,
                            number: season.season_number,
                            episodes: episodesArr
                        }

                        newSeasonsDetail.push(newSeasonDetailElement)
                    })

                    user.series[user.series.indexOf(
                        user.series.find(serie => serie.id === serieId)
                    )].seasonsDetail = newSeasonsDetail
                }

                user.markModified('series')
                user.save()

                response.status(200).json({
                    message: 'Serie updated'
                })

            } else {
                user.series.forEach( (serie, index) => {
                    if(serie.id === serieId) {
                        user.series.splice(index, 1)
                    }
                })
            }
            user.markModified('series')
            user.save()
            response.status(200).json({
                message: 'Serie updated'
            })
        } else {
            response.status(404).send('User not found')
        }

    })

   


}