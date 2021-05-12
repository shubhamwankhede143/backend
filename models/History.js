const mongoose = require('mongoose')
const Schema = mongoose.Schema

const historySchema = new Schema({
    userId: {
        type: String
    },
    postId: {
        type: String
    },
    score: {
        type: String
    },
    token: {
        type: String
    },
    status: {
        type: String
    },
}, { timestamps: true })

const History = mongoose.model('History', historySchema)

module.exports = History
