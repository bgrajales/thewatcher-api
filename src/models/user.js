const { model, Schema } = require('mongoose')

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: { 
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    },
    region: { 
        type: String, 
        required: true 
    },
    series: [{
        id: {
            type: String,
            required: true
        },
        posterPath: {
            type: String,
            required: true
        },
        episodesTotal: {
            type: Number,
            required: true
        },
        episodesWatched: {
            type: Number,
            required: true
        },
        seasonsDetail: {
            type: Array,
            required: true
        }
    }],
    movies: [{
        id: {
            type: String,
            required: true
        },
        posterPath: {
            type: String,
            required: true
        },
        runTime: {
            type: Number,
            required: true
        },
    }],
    profilePicture: {
        type: String,
        required: false
    }
})

const userModel = model('users', userSchema)

module.exports = {
    userSchema,
    userModel
}
