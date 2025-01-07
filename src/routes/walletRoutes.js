const express = require('express');
const router = express.Router();
const walletControllers = require('../controllers/walletControllers');

router.get('/balance/:address', walletControllers.getWalletBalance);
router.post('/send', walletControllers.sendTransaction);

module.exports = router;