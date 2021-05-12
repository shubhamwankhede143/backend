const express = require('express');
const router = express.Router();
const authPermissions = require('../controllers/middleware');
const TransactionController = require('../controllers/TransactionController')

router.post('/transaction',TransactionController.createTransaction)
router.post('/transactions',TransactionController.getAllTransaction)
router.put('/transaction/:transactionId',TransactionController.updateTransaction)
router.get('/transaction/:transactionId',TransactionController.getTransaction)
router.delete('/transaction/:transactionId',TransactionController.deleteTransaction)

module.exports = router