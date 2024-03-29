const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const user = request.body.userName
    const serieId = request.body.id
    const posterPath = request.body.posterPath
    const action = request.body.action
    const serieTotalEpisodes = request.body.serieTotalEpisodes
    const seriesSeasons = request.body.seriesSeasons
    const seriesStatus = request.body.seriesStatus

    userModel.findOne({
        userName: user
    }).then( user => {

        if(user) {
            if(action === 'add') {
                
                let exists = false

                user.series.forEach(serie => {
                    if(parseInt(serie.id) === parseInt(serieId)) {
                        exists = true
                    }
                })

                if(!exists) {

                    const newSeasonsDetail = []

                    seriesSeasons.forEach(season => {
                        if( season.season_number > 0 ) {
                            const episodesArr = []
    
                            for (let index = 1; index <= season.episode_count; index++) {
                                episodesArr.push(index)                           
                            }
    
                            const newSeasonDetailElement = {
                                id: season.id,
                                number: season.season_number,
                                episodes: episodesArr
                            }
    
                            newSeasonsDetail.push(newSeasonDetailElement)
                        }
                    })

                    const newSerie = {
                        id: serieId,
                        posterPath: posterPath,
                        episodesTotal: serieTotalEpisodes,
                        episodesWatched: serieTotalEpisodes,
                        seasonsDetail: newSeasonsDetail,
                        seriesStatus: seriesStatus,
                        dateAdded: Date.now(),
                        dateModified: Date.now(),
                    }

                    user.series.unshift(newSerie)

                } else {
                    const newSeasonsDetail = []

                    seriesSeasons.forEach(season => {
                        if( season.season_number > 0 ) {
                            const episodesArr = []
    
                            for (let index = 1; index <= season.episode_count; index++) {
                                episodesArr.push(index)                           
                            }
    
                            const newSeasonDetailElement = {
                                id: season.id,
                                number: season.season_number,
                                episodes: episodesArr
                            }
    
                            newSeasonsDetail.push(newSeasonDetailElement)
                        }
                    })

                    user.series[user.series.indexOf(
                        user.series.find(serie => parseInt(serie.id) === parseInt(serieId))
                    )].seasonsDetail = newSeasonsDetail

                    user.series[user.series.indexOf(
                        user.series.find(serie => parseInt(serie.id) === parseInt(serieId))
                    )].episodesWatched = serieTotalEpisodes

                    user.series[user.series.indexOf(
                        user.series.find(serie => parseInt(serie.id) === parseInt(serieId))
                    )].dateModified = Date.now()

                }

                user.markModified('series')
                user.save()

                response.status(200).json({
                    message: 'Serie updated',
                    series: user.series
                })

            } else {
                
                // remove serie from user serie

                user.series.splice(user.series.indexOf(
                    user.series.find(serie => parseInt(serie.id) === parseInt(serieId))
                ), 1)

                user.markModified('series')
                user.save()

                response.status(200).json({
                    message: 'Serie removed',
                    series: user.series
                })

            }
        } else {
            response.status(404).send('User not found')
        }

    })

   


}