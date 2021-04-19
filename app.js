const express = require('express')
const mongoose = require('mongoose')
const moongoDbConnection = require('./db/connection')
const AuthRoutes = require('./routes/auth')
const PostRoutes = require('./routes/post')
const bodyParser = require('body-parser')
const isDevMode = process.env.NODE_ENV === 'development';
const app = express()
const NodeRSA = require('node-rsa');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser')
var cors = require('cors')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
//enables cors
app.use(cors());
// app.set('trust proxy', 1)

// 1st change.
if (!isDevMode) {
    app.set('trust proxy', 1);
}

const swaggerOptions 

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers","*, Authorization")
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

// var corsOptions = {
//     origin: function (origin, callback) {
//       // db.loadOrigins is an example call to load
//       // a list of origins from a backing database
//       db.loadOrigins(function (error, origins) {
//         callback(error, origins)
//       })
//     }
//   }


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

app.use('/uploads',express.static('uploads'))


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




// app.use('/api',AuthRoutes)
app.use('/api', AuthRoutes)

app.use('/api', PostRoutes)


function randomStr(len, arr) {
    var ans = '';
    for (var i = len; i > 0; i--) {
        ans +=
            arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}
// console.log(uuid.v1());

app.listen(3001, () => {
    console.log('listening on port 3001')
})



