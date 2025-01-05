const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradingController');

router.get('/quote/:symbol', tradeController.getQuote);
router.get('/intraday/:symbol/:interval', tradeController.getIntraday);
router.get('/daily/:symbol', tradeController.getDaily);

module.exports = router;