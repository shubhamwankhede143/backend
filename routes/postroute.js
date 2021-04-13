const express = require('express');
const router = express.Router();

const PostController = require('../controllers/PostController')

router.post('/register',AuthController.register)


module.exports = router