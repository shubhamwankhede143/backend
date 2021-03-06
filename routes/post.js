const express = require('express');
const router = express.Router();
var multer = require('multer')
const authPermissions = require('../controllers/middleware');
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

router.post('/post', PostController.createPost)
router.post('/posts',PostController.getAllPost)
router.get('/postscount',PostController.getPostCount)
router.post('/tagposts',PostController.getAllPostByTagIds)
router.put('/post/:postId',PostController.updatePost)
router.get('/post/:postId',PostController.getPost)
router.delete('/post/:postId',PostController.deletePost)
module.exports = router