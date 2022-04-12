const { model, Schema } = require('mongoose')

const forumSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    elementId: {
        type: String,
        required: true
    },
    comments: [{
        userName: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        likes: {
            type: Number,
            default: 0
        },
        replies: [{
            userName: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            },
            likes: {
                type: Number,
                default: 0
            },
        }],
    }],   
        
})

const forumModel = model('forums', forumSchema)

module.exports = {
    forumSchema,
    forumModel
}
