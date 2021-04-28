const express = require('express');
const router = express.Router();

const TagController = require('../controllers/TagController')


router.post('/tag', TagController.createTag)
router.post('/tags',TagController.getAllTag)
module.exports = router