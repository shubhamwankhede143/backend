const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
    userId: {
        type: String
    },
    receivingAddress: {
        type: String
    },
    token: {
        type: String
    },
    status: {
        type: String
    },
    orderDateTime: {
        type: String
    },
    reasons:{
        type:String
    }
}, { timestamps: true })

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
