const express = require("express");
const tradingController = require("../controllers/tradeController");

const router = express.Router();

// Market Data
router.get("/market/data", tradingController.fetchMarketData);
router.get("/market/tickers/:ticker", tradingController.fetchTickerInfo);

// Trading Operations
router.post("/trade/place-order", tradingController.placeOrder);
router.post("/trade/cancel-order", tradingController.cancelOrder);
router.get("/trade/order-history", tradingController.fetchOrderHistory);

// Crypto
router.get('/crypto/coin/:coinId', tradingController.getCoin);
router.get('/crypto/market', tradingController.getMarket);
router.get('/crypto/historical/:coinId/:date', tradingController.getHistorical);
router.get('/crypto/all-coins', tradingController.getAllCoins); // New route for fetching all coins
router.get('/crypto/all-markets', tradingController.getAllMarkets); // New route for fetching all markets

module.exports = router;
