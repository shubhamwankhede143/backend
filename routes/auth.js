const express = require('express');
const router = express.Router();
const authPermissions = require('../controllers/middleware');
const AuthController = require('../controllers/AuthController')
router.post('/init',AuthController.init)
router.post('/register',AuthController.register)
router.post('/login',AuthController.login)
router.get('/user/:userId',AuthController.getUserDetails)
router.put('/user/:userId',AuthController.updateUser)
router.delete('/user/:userId',AuthController.deleteUser)
router.put('/user/changepass/:userId',AuthController.changeUserPassword)
router.post('/users',AuthController.getAllUser)

module.exports = router