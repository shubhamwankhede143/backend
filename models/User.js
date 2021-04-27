const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    banner: {
        type: String,
    },
    picture: {
        type: String,
    },
    role: {
        type: String,
    },
    socialAccount: {
        type: String,
    },
    password: {
        type: String,
    }, 
    status: {
        type: String,
    }

}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User
