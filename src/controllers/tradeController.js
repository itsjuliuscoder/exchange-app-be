const polygonService = require("../services/polygonService");
const coinGeckoService = require('../services/coinGeckoService');

const fetchMarketData = async (req, res) => {
    try {
        const data = await polygonService.getMarketData();
        console.log("market data response -->", data);
        res.json(data);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: error.message });
    }
};

const fetchTickerInfo = async (req, res) => {
    try {
        const { ticker } = req.params;
        const data = await polygonService.getTickerInfo(ticker);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const placeOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const response = await polygonService.placeOrder(orderData);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const response = await polygonService.cancelOrder(orderId);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchOrderHistory = async (req, res) => {
    try {
        const { userId } = req.query;
        const response = await polygonService.getOrderHistory(userId);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCoin = async (req, res) => {
    const { coinId } = req.params;

    try {
        const coinData = await coinGeckoService.getCoinData(coinId);
        res.status(200).json(coinData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching coin data' });
    }
};

const getMarket = async (req, res) => {
const { vsCurrency, ids } = req.query;

try {
    const marketData = await coinGeckoService.getMarketData(vsCurrency, ids);
    res.status(200).json(marketData);
} catch (error) {
    res.status(500).json({ message: 'Error fetching market data' });
}
};

const getHistorical = async (req, res) => {
    const { coinId, date } = req.params;

    try {
        const historicalData = await coinGeckoService.getHistoricalData(coinId, date);
        res.status(200).json(historicalData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching historical data' });
    }
};

const getAllCoins = async (req, res) => {
    try {
      const allCoins = await coinGeckoService.getAllCoins();
      res.status(200).json(allCoins);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching all coins' });
    }
};

const getAllMarkets = async (req, res) => {
    try {
        const allMarkets = await coinGeckoService.getAllMarkets();
        res.status(200).json(allMarkets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all markets' });
    }
}

module.exports = {
    fetchMarketData,
    fetchTickerInfo,
    placeOrder,
    cancelOrder,
    fetchOrderHistory,
    getCoin,
    getMarket,
    getHistorical,
    getAllCoins,
    getAllMarkets
};
