const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const user = request.body.user
    const serieId = request.body.serieId
    const posterPath = request.body.posterPath
    const episodesTotal = request.body.serieTotalEpisodes
    const seasonId = request.body.seasonId
    const seasonNumber = request.body.seasonNumber
    const episodeNumber = request.body.episodeNumber
    const seriesStatus = request.body.seriesStatus

    userModel.findOne({
        userName: user.userName
    }).then(user => {

        if (user) {

            const seriesIndex = user.series.findIndex(serie => parseInt(serie.id) === parseInt(serieId))

            if (seriesIndex === -1) {

                    const newSerie = {
                        id: serieId,
                        posterPath: posterPath,
                        episodesTotal: episodesTotal,
                        episodesWatched: 1,
                        seasonsDetail: [{
                            id: seasonId,
                            number: seasonNumber,
                            episodes: [ episodeNumber ]
                        }],
                        seriesStatus: seriesStatus,
                        dateAdded: Date.now(),
                        dateModified: Date.now()
                    }

                    user.series.push(newSerie)

            } else {

                const seasonsDetailIndex = user.series[seriesIndex].seasonsDetail.findIndex(season => parseInt(season.id) === parseInt(seasonId))

                if (seasonsDetailIndex === -1) {

                    const newSeason = {
                        id: seasonId,
                        number: seasonNumber,
                        episodes: [ episodeNumber ]
                    }

                    user.series[seriesIndex].seasonsDetail.push(newSeason)

                    user.series[seriesIndex].episodesWatched += 1

                    user.series[seriesIndex].dateModified = Date.now()

                } else {

                    const episodesIndex = user.series[seriesIndex].seasonsDetail[seasonsDetailIndex].episodes.findIndex(episode => parseInt(episode) === parseInt(episodeNumber))

                    if (episodesIndex === -1) {

                        user.series[seriesIndex].seasonsDetail[seasonsDetailIndex].episodes.push(episodeNumber)
                        user.series[seriesIndex].episodesWatched += 1

                    } else {

                        user.series[seriesIndex].seasonsDetail[seasonsDetailIndex].episodes.splice(episodesIndex, 1)
                        user.series[seriesIndex].episodesWatched -= 1

                        if ( user.series[seriesIndex].episodesWatched === 0 ) {
                            user.series.splice(seriesIndex, 1)
                        }

                    }

                    user.series[seriesIndex].dateModified = Date.now()
            
                }

            }

            const seriesIndexToMove = user.series.findIndex(serie => parseInt(serie.id) === parseInt(serieId));

            // Si la serie fue encontrada
            if (seriesIndexToMove !== -1) {
                // Remueve la serie del array
                const [modifiedSeries] = user.series.splice(seriesIndex, 1);

                // Inserta la serie al inicio del array
                user.series.unshift(modifiedSeries);
            }

            user.markModified('series')

            user.save()

            response.status(200).json({
                message: 'Serie updated',
                series: user.series
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