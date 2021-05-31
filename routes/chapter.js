const express = require('express');
const router = express.Router();
const authPermissions = require('../controllers/middleware');
const ChapterController = require('../controllers/ChapterController')


router.post('/chapter/',ChapterController.createChapter)
router.post('/chapters/',ChapterController.getAllChapter)
router.put('/chapter/:chapterId',ChapterController.updateChapter)
router.get('/chapter/:chapterId',ChapterController.getChapter)
router.delete('/chapter/:chapterId',ChapterController.deleteChapter)
module.exports = router