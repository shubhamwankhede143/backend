const express = require('express');
const router = express.Router();
const authPermissions = require('../controllers/middleware');
const HistoryController = require('../controllers/HistoryController')


router.post('/history',HistoryController.createHistory)
router.post('/histories',HistoryController.getAllHistory)
router.put('/history/:historyId',HistoryController.updateHistory)
router.get('/history/:historyId',HistoryController.getHistory)
router.delete('/history/:historyId',HistoryController.deleteHistory)
module.exports = router