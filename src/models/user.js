const { string, required } = require('joi')
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
    seriesGenres: [{
        genreId: {
            type: Number,
            required: true
        },
        genre: {
            type: String,
            required: true
        }
    }],
    moviesGenres: [{
        genreId: {
            type: Number,
            required: true
        },
        genre: {
            type: String,
            required: true
        }
    }],
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
        },
        seriesStatus: {
            type: String,
            required: true
        },
        dateAdded: {
            type: Date,
            required: true
        },
        dateModified: {
            type: Date,
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
        dateAdded: {
            type: Date,
            required: true
        },
    }],
    watchlist: [{
        elementId: {
            type: String,
            required: true
        },
        posterPath: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    }],
    likedComments: [{
        type: String,
    }],
    settings:{
        leng: {
            type: String,
            required: true
        },
        verifyCode: {
            type: String,
            required: false,
            default: null
        },
        newAccount: {
            type: Boolean,
            required: false,
            default: false
        },
        dateCreated: {
            type: Date,
            required: false,
        },
        notificationsTokens: [{
            type: String,
            required: true
        }]
    },
    social: {
        notifications: [{
            type:{
                type: String,
                required: true
            },
            title:{
                type: String,
                required: true
            },
            text:{
                type: String,
                required: true
            },
            status:{
                type: String,
                required: true
            }
        }],
        followers: [{
            userName: {
                type: String,
                required: true
            }
        }],
        following: [{
            userName: {
                type: String,
                required: true
            }
        }]
    },
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
