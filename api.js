
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

const markMovieAsWatched = require('./src/controllers/movies/markMovieAsWatched')
const markMovieUnwatched = require('./src/controllers/movies/markMovieUnwatched')

const updateEpisode = require('./src/controllers/series/updateEpisode')

const postComment = require('./src/controllers/forums/postComment')

app.post('/register', register)
app.post('/login', login)
app.post('/refreshToken', refreshToken)

app.post('/markMovieAsWatched', markMovieAsWatched)
app.post('/markMovieUnwatched', markMovieUnwatched)

app.post('/updateEpisode', updateEpisode)

app.post('/postComment', postComment)

mongoose.connect(getDbConnectionString(), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })
}).catch(err => {
    console.log(err)
})
