const express = require('express');
const router = express.Router();
const authPermissions = require('../controllers/middleware');
const AuthController = require('../controllers/AuthController')

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       picture:
 *         type: string
 *       slug:
 *         type: string
 *       role:
 *         type: string
 *       social_icon:
 *         type: string
 *       password:
 *         type: string
 *       description:
 *         type: string
 *       status:
 *         type: string
 */


/**
 * @swagger
 * /api/init:
 *   post:
 *     tags:
 *       - Init api
 *     description: Init api 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: publicKey
 *         description: Client public key
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Init api call successfully
 */
router.post('/init',AuthController.init)

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags:
 *       - Register User
 *     description: Register User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: User full name
 *         in: body
 *         required: true
 *         type: string
 *       - name: email
 *         description: User email id
 *         in: body
 *         required: true
 *         type: string
 *       - name: picture
 *         description: User picture url
 *         in: body
 *         required: true
 *         type: string
 *       - name: slug
 *         description: slug
 *         in: body
 *         required: true
 *         type: string
 *       - name: slug
 *         description: slug
 *         in: body
 *         required: true
 *         type: string
 *       - name: social_icon
 *         description: social icon of user
 *         in: body
 *         required: true
 *         type: string
 *       - name: description
 *         description: description of user
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         description: password of user
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: User successfully registered
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.post('/register',authPermissions.authPermissions(['1']),AuthController.register)


/**
 * @swagger
 * /api/login:
 *   post:
 *     tags:
 *       - User Login
 *     description: User Login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: User username
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         description: User password
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User successfully logged in
 */
router.post('/login',AuthController.login)

router.get('/user/:userId',AuthController.getUserDetails)

router.put('/user/:userId',AuthController.updateUser)


router.post('/users',authPermissions.authPermissions(['admin']),AuthController.getAllUser)

module.exports = router