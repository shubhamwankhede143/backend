const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quizSchema = new Schema({
        postId: {
            type:String
        },
        question: {
            type:String
        },
        optionType: {
            type:String
        },
        options: {
            type:String
        },
        answer: {
            type:String
        },
        timing: {
            type:String
        }

}, { timestamps: true })

const Quiz = mongoose.model('Quiz', quizSchema)

module.exports = Quiz
