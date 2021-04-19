const express = require('express');
const router = express.Router();
var multer = require('multer')
const PostController = require('../controllers/PostController')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter:fileFilter
})



router.post('/post', upload.single('postImage'), PostController.createPost)
router.get('/post',PostController.getAllPost)

module.exports = router