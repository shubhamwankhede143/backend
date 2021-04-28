const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = new Schema({
   title: {
       type: String,
   },
   slug: {
       type: String,
   },
   status: {
       type: String,
   },
   action: {
       type: String,
   }

}, { timestamps: true })

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag
