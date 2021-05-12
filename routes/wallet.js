const express = require('express');
const router = express.Router();
const authPermissions = require('../controllers/middleware');
const WalletController = require('../controllers/WalletController')


router.post('/wallet',WalletController.createWallet)
router.post('/wallets',WalletController.getAllWallet)
router.put('/wallet/:walletId',WalletController.updateWallet)
router.get('/wallet/:walletId',WalletController.getWallet)
router.delete('/wallet/:walletId',WalletController.deleteWallet)
module.exports = router