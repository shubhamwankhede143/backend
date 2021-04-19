const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fileSchema = new Schema({
    url: {
        type: String,
    },
},{ timestamps: true })

const File = mongoose.model('File', fileSchema)

module.exports = File