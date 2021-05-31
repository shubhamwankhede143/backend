const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chapterSchema = new Schema({
    chapter: {
        type:Array
    }
},{timestamps:true})

const Chapter = mongoose.model('chapter',chapterSchema)
module.exports = Chapter