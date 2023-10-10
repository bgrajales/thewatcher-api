const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const user = request.body.userName
    const serieId = request.body.serieId
    const seasonId = request.body.seasonId
    const seasonNumber = request.body.seasonNumber
    const seasonEpisodes = request.body.seasonEpisodes
    const posterPath = request.body.posterPath
    const serieEpisodes = request.body.serieEpisodes
    const seriesStatus = request.body.seriesStatus
    const action = request.body.action

    console.log(
        'user: ' + user +
        '\nserieId: ' + serieId +
        '\nseasonId: ' + seasonId +
        '\nseasonNumber: ' + seasonNumber +
        '\nseasonEpisodes: ' + seasonEpisodes +
        '\nposterPath: ' + posterPath +
        '\nserieEpisodes: ' + serieEpisodes +
        '\naction: ' + action
    )
    
    userModel.findOne({
        userName: user
    }).then( user => {

        let exists = false
    
        user.series.forEach(serie => {
            if ( parseInt(serie.id) === parseInt(serieId) ) {
                exists = true
            }
        })

        if ( action === 'add') {
                
            if ( !exists ) {

                const episodesArr = []

                for (let index = 1; index <= seasonEpisodes; index++) {
                    episodesArr.push(index)
                }

                const newSeasonDetailElement = {
                    id: seasonId,
                    number: seasonNumber,
                    episodes: episodesArr
                }

                user.series.push({
                    id: serieId,
                    posterPath: posterPath,
                    episodesTotal: serieEpisodes,
                    episodesWatched: serieEpisodes,
                    seasonsDetail: [ newSeasonDetailElement ],
                    seriesStatus: seriesStatus
                })

            } else {

                const seriesIndex = user.series.indexOf(
                    user.series.find(serie => parseInt(serie.id) === parseInt(serieId))
                )

                let seasonExists = false

                user.series[seriesIndex].seasonsDetail.forEach( season => {
                    if ( season.number === seasonNumber ) {
                        seasonExists = true
                    }
                })

                if ( !seasonExists ) {

                    const episodesArr = []

                    for (let index = 1; index <= seasonEpisodes; index++) {
                        episodesArr.push(index)
                    }

                    const newSeasonDetailElement = {
                        id: seasonId,
                        number: seasonNumber,
                        episodes: episodesArr
                    }

                    user.series[seriesIndex].seasonsDetail.push( newSeasonDetailElement )

                } else {

                    const seasonIndex = user.series[seriesIndex].seasonsDetail.indexOf(
                        user.series[seriesIndex].seasonsDetail.find(season => parseInt(season.number) === parseInt(seasonNumber))
                    )

                    const episodesArr = []

                    for (let index = 1; index <= seasonEpisodes; index++) {
                        episodesArr.push(index)
                    }

                    user.series[seriesIndex].seasonsDetail[seasonIndex].episodes = episodesArr

                }
                
                
            }
    
        } else {

            if ( exists ) {

                const seriesIndex = user.series.indexOf(
                    user.series.find(serie => parseInt(serie.id) === parseInt(serieId))
                )

                const seasonIndex = user.series[seriesIndex].seasonsDetail.indexOf(
                    user.series[seriesIndex].seasonsDetail.find(season => parseInt(season.number) === parseInt(seasonNumber))
                )

                user.series[seriesIndex].seasonsDetail.forEach( season => {
                    if ( season.number === seasonNumber ) {
                        user.series[seriesIndex].seasonsDetail[user.series[seriesIndex].seasonsDetail.splice(seasonIndex, 1)]
                    }
                })

                if ( user.series[seriesIndex].seasonsDetail.length === 0 ) {
                    user.series.splice(seriesIndex, 1)
                }

            } else {
                return response.status(200).json({
                    message: 'Serie not found'
                })
            }

        }

        let episodesWatchNumber = 0

        const seriesIndex = user.series.indexOf(
            user.series.find(serie => parseInt(serie.id) === parseInt(serieId))
        )

        if (seriesIndex !== -1) {
            const seasonIndex = user.series[seriesIndex].seasonsDetail.indexOf(
                user.series[seriesIndex].seasonsDetail.find(season => parseInt(season.number) === parseInt(seasonNumber))
            )
    
            user.series[seriesIndex].seasonsDetail.forEach( seasonDetail => {
    
                seasonDetail.episodes.forEach( episode => {
                    episodesWatchNumber++
                })
    
            })
    
            user.series[seriesIndex].episodesWatched = episodesWatchNumber
        }

        const notCompletedSeries = user.series.filter(serie => serie.episodesWatched !== serie.episodesTotal)
        const completedSeries = user.series.filter(serie => serie.episodesWatched === serie.episodesTotal)

        user.series = notCompletedSeries.concat(completedSeries)

        user.markModified('series')
        user.save()
        
        response.status(200).json({
            message: 'Serie updated',
            series: user.series
        })

    })

}