const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController')

router.post('/register',AuthController.register)

router.post('/init',AuthController.init)

router.post('/login',AuthController.login)

router.get('/user',AuthController.getUserDetails)

module.exports = router