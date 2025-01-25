const express = require('express');
const router = express.Router();
const walletControllers = require('../controllers/walletControllers');

router.post('/create', walletControllers.createWallet);

router.put('/update-balance', walletControllers.updateWalletBalance);

router.put('/update-balance-manual', walletControllers.updateWalletBalanceManual);

router.get('/list-all-wallets', walletControllers.listAllWallets);

router.get('/get-wallet/:userId', walletControllers.getWalletByUserId);


module.exports = router;