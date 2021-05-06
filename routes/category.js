const express = require('express');
const router = express.Router();
const authPermissions = require('../controllers/middleware');
const CategoryController = require('../controllers/CategoryController')


router.post('/category/', authPermissions.authPermissions(['1']) ,CategoryController.createCategory)
router.post('/categories/',CategoryController.getAllCategory)
router.put('/category/:categoryId',CategoryController.updateCategory)
router.get('/category/:categoryId',CategoryController.getCategory)
module.exports = router