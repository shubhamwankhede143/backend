const express = require('express');
const router = express.Router();
const authPermissions = require('../controllers/middleware');
const TagController = require('../controllers/TagController')


router.post('/tag', authPermissions.authPermissions(['1']) ,TagController.createTag)
router.post('/tags/search',TagController.getAllTag)
router.get('/tags',TagController.getAllTagDropdown)
router.put('/tags:tagId',TagController.updateTag)
router.get('/tags/:tagId',TagController.getTag)
router.delete('/tags/:tagId',TagController.deleteTag)
module.exports = router