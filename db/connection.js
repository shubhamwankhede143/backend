const mongoose = require('mongoose')
// const URI = 'mongodb+srv://shubham:Shubham@sw1@cluster0.gxroq.mongodb.net/sample?retryWrites=true&w=majority'
const URI = 'mongodb+srv://Shubham:Shubham@sw1@cluster0.cgstr.mongodb.net/sample?retryWrites=true&w=majority'
// const URI = 'mongodb://localhost/sample'
mongoose.connect(URI,{
    useUnifiedTopology:true,
    useNewUrlParser :true,
})

mongoose.connection.once('open',()=>{
    console.log('Connected to mongoDB')
})

module.exports = mongoose.connection