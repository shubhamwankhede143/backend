const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
   userId: {
       type: String,
   },
   title: {
       type: String,
   },
   slug: {
       type: String,
   }

}, { timestamps: true })

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
