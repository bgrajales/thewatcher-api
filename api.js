require('dotenv').config()

const mongoose = require('mongoose')
const mongooseToJson = require('@meanie/mongoose-to-json')
const express = require('express')
const cors =  require('cors')
const getDbConnectionString = require('./src/utils/get-db-connection-string')

mongoose.plugin(mongooseToJson)

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4001

// const checkUserCredentials = require('./src/middlewares/checkUserCredentials')

const register = require('./src/controllers/auth/register')
const login = require('./src/controllers/auth/login')
const refreshToken = require('./src/controllers/auth/refreshToken')
const setGenres = require('./src/controllers/auth/setGenres')
const updateWatchlist = require('./src/controllers/auth/updateWatchlist')
const deleteAccount = require('./src/controllers/auth/deleteAccount')
const changeLenguage = require('./src/controllers/auth/changeLenguage')
const changeNewAccount = require('./src/controllers/auth/changeNewAccount')
const verifyEmail = require('./src/controllers/auth/verifyEmail')
const resetPassword = require('./src/controllers/auth/resetPassword')
const changePassword = require('./src/controllers/auth/changePassword')

const markMovieAsWatched = require('./src/controllers/movies/markMovieAsWatched')
const markMovieUnwatched = require('./src/controllers/movies/markMovieUnwatched')

const updateEpisode = require('./src/controllers/series/updateEpisode')
const markSerieAsWatched = require('./src/controllers/series/markSerieAsWatched')
const markSeasonWatched = require('./src/controllers/series/markSeasonWatched')
const updateSeriesEpisodes = require('./src/controllers/series/updateSeriesEpisodes.js')


const postComment = require('./src/controllers/forums/postComment')
const fetchComments = require('./src/controllers/forums/fetchComments')
const likeComment = require('./src/controllers/forums/likeComment')
const postReply = require('./src/controllers/forums/postReply')

const searchUsers = require('./src/controllers/social/searchUsers')

app.post('/register', register)
app.post('/login', login)
app.post('/refreshToken', refreshToken)
app.post('/setGenres', setGenres)
app.post('/updateWatchlist', updateWatchlist)
app.post('/deleteAccount', deleteAccount)
app.post('/changeLenguage', changeLenguage)
app.post('/changeNewAccount', changeNewAccount)
app.post('/verifyEmail', verifyEmail)
app.post('/resetPassword', resetPassword)
app.post('/changePassword', changePassword)


app.post('/markMovieAsWatched', markMovieAsWatched)
app.post('/markMovieUnwatched', markMovieUnwatched)

app.post('/updateEpisode', updateEpisode)
app.post('/markSerieAsWatched', markSerieAsWatched)
app.post('/markSeasonWatched', markSeasonWatched)
app.post('/updateSeriesEpisodes', updateSeriesEpisodes)

app.post('/postComment', postComment)
app.post('/likeComment', likeComment)
app.get('/fetchComments', fetchComments)
app.post('/postReply', postReply)

app.post('/searchUsers', searchUsers)

//const updateUsers = require('./src/utils/updateUsers.js')

mongoose.connect(getDbConnectionString(), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    //updateUsers()

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })
}).catch(err => {
    console.log(err)
})
