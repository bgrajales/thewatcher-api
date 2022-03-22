const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const user = request.body.user
    const serieId = request.body.serieId
    const posterPath = request.body.posterPath
    const episodesTotal = request.body.serieTotalEpisodes
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

            console.log('Found User', user.userName)

            const seriesIndex = user.series.findIndex(serie => parseInt(serie.id) === parseInt(serieId))

            if (seriesIndex === -1) {

                console.log('No series found')

                    const newSerie = {
                        id: serieId,
                        posterPath: posterPath,
                        episodesTotal: episodesTotal,
                        episodesWatched: 1,
                        seasonsDetail: [{
                            id: seasonId,
                            number: seasonNumber,
                            seasonEpisodesWatched: 1,
                            episodes: [ episodeNumber ]
                        }]
                    }

                    console.log(newSerie)

                    user.series.push(newSerie)

            } else {

                console.log('Series')
                
                const seasonsDetailIndex = user.series[seriesIndex].seasonsDetail.findIndex(season => parseInt(season.id) === parseInt(seasonId))

                if (seasonsDetailIndex === -1) {

                    console.log('No season found')

                    const newSeason = {
                        id: seasonId,
                        number: seasonNumber,
                        seasonEpisodesWatched: 1,
                        episodes: [ episodeNumber ]
                    }

                    user.series[seriesIndex].seasonsDetail.push(newSeason)

                    user.series[seriesIndex].episodesWatched += 1

                } else {

                    console.log('Season found')

                    const episodesIndex = user.series[seriesIndex].seasonsDetail[seasonsDetailIndex].episodes.findIndex(episode => parseInt(episode) === parseInt(episodeNumber))

                    if (episodesIndex === -1) {

                        console.log('No episode found')

                        user.series[seriesIndex].seasonsDetail[seasonsDetailIndex].episodes.push(episodeNumber)
                        user.series[seriesIndex].episodesWatched += 1
                        user.series[seriesIndex].seasonsDetail[seasonsDetailIndex].seasonEpisodesWatched += 1

                    } else {

                        console.log('Episode found')

                        user.series[seriesIndex].seasonsDetail[seasonsDetailIndex].episodes.splice(episodesIndex, 1)
                        user.series[seriesIndex].episodesWatched -= 1
                        user.series[seriesIndex].seasonsDetail[seasonsDetailIndex].seasonEpisodesWatched -= 1

                        if ( user.series[seriesIndex].episodesWatched === 0 ) {
                            user.series.splice(seriesIndex, 1)
                        }

                    }
            
                }

            }

            console.log(user.series)

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