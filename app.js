const express = require('express')
const mongoose = require('mongoose')
const moongoDbConnection = require('./db/connection')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')
const AuthRoutes = require('./routes/auth')
const AcademyRoutes = require('./routes/academy')
const PostRoutes = require('./routes/post')
const TransactionRoutes = require('./routes/transaction')
const HistoryRoutes = require('./routes/history')
const WalletRoutes = require('./routes/wallet')
const QuizRoutes = require('./routes/quiz')
const FileRoutes = require('./routes/file')
const TagRoutes = require('./routes/tag')
const CategoryRoute = require('./routes/category')
const bodyParser = require('body-parser')
const isDevMode = process.env.NODE_ENV === 'development';
const app = express()
const NodeRSA = require('node-rsa');
const session = require('express-session')
const uuid = require('uuid')
const MongoStore = require('connect-mongo')(session);
require('dotenv/config')
const multer = require('multer')
const cookieParser = require('cookie-parser')
var cors = require('cors')
const AWS = require('aws-sdk')
const PORT = 8080;

//enables cors
app.use(cors());
// app.set('trust proxy', 1)

// 1st change.
if (!isDevMode) {
    app.set('trust proxy', 1);
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers","*, Authorization")
    res.header("Access-Control-Allow-Credentials", true);
    next();
});


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: moongoDbConnection,
        collection: 'sessions'
    }),
}))

app.use(cookieParser())

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'NDX BLOGS API DOCUMENTATION',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/uploads',express.static('uploads'))

const s3 = new AWS.S3({
    accessKeyId: 'AKIAUYBCIHPZJKJB25LZ',
    secretAccessKey: '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',
}) 
const storage = multer.memoryStorage({
    destination:function(req, file,callback){
        callback(null,'')
    }
})

const upload = multer({storage}).single('video')

app.post('/upload',upload,(req, res)=>{
    let fileName = req.file.originalname.split('.')
    console.log(req.file)
    const fileType = fileName[fileName.length-1]

    const params = {
        Bucket:'ndx-aws-bucket',
        Key:`${uuid.v4()}.${fileType}`,
        Body:req.file.buffer
    }

    s3.upload(params,(error,data)=>{
        if(error){
            res.status(500).send(error)
        }
        res.status(200).send(data)
    })
})

const user = {
    name: 'John',
    age: 18,
    nationality: 'Indian'
}



app.get('/login', (req, res) => {
    console.log('In login api')
    req.session.user = user;
    req.session.save();
    return res.send('User logged in successfully')
})

 
app.get('/user',(req,res)=>{
    return res.send(req.session.user)
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('User logged out')
})

app.use('/api', AuthRoutes)
app.use('/api', PostRoutes)
app.use('/api', FileRoutes)
app.use('/api', TagRoutes)
app.use('/api', CategoryRoute)
app.use('/api', AcademyRoutes)
app.use('/api', QuizRoutes)
app.use('/api', WalletRoutes)
app.use('/api', HistoryRoutes)
app.use('/api', TransactionRoutes)

function randomStr(len, arr) {
    var ans = '';
    for (var i = len; i > 0; i--) {
        ans +=
            arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})