const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    userId: {
        type: String,
    },
    tagId: {
        type: String,
    },
    picture: {
        type: String,
    },
    title: {
        type: String,
    },
    slug: {
        type: String,
    },
    content: {
        type: String,
    },
    sortDescription:{
        type: String,
    },
    status: {
        type: String,
    },
    verifiedBy: {
        type: String,
    }

}, { timestamps: true })

const Post = mongoose.model('Post', postSchema)

module.exports = Post
