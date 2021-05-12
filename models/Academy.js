const mongoose = require('mongoose')
const Schema = mongoose.Schema

const academySchema = new Schema({
    userId: {
        type: String,
    },
    academyChapter: {
        type: Array,
    },
    categoryId: {
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
    }
    ,
    slug: {
        type: String,
    }
    ,
    sortDescription: {
        type: String,
    },
    status: {
        type: String
    },
    verifiedBy: {
        type: String
    }


}, { timestamps: true })

const Academy = mongoose.model('Academy', academySchema)

module.exports = Academy
