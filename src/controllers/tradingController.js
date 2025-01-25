const polygonService = require("../services/polygonService");
const coinGeckoService = require('../services/coinGeckoService');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Signal = require('../models/Signal');
const Trade = require('../models/Trade');


const createTrade = async (req, res) => {
    const { userId, signalId, tradeType, amount, units, interval } = req.body;
  
    console.log("req.body -->", req.body);
  
    try {
      // Validate user
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const leverage = user.leverage
  
      // Validate signal
      const signal = await Signal.findById(signalId);
      if (!signal) return res.status(404).json({ message: 'Signal not found' });
  
      // Determine wallet type
      const walletType = tradeType.toLowerCase() === 'buy' ? 'fiat' : 'crypto';
      const wallet = await Wallet.findOne({ userId, walletType });
  
      if (!wallet) {
        return res.status(400).json({ message: 'User wallet not found' });
      }
  
      // Fetch the asset's current value
      const currentValue = 1000; // Placeholder value, replace with actual asset value fetching logic
  
      // Calculate the total cost of the trade
      const totalCost = tradeType.toLowerCase() === 'buy' ? amount : units * currentValue;
  
      // Validate wallet balance for trade
      if (tradeType.toLowerCase() === 'buy' && wallet.balance < totalCost) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
      
      if (tradeType.toLowerCase() === 'sell' && wallet.balance < units) {
        return res.status(400).json({ message: 'Insufficient asset units to sell' });
      }
  
      // Deduct or add balance for the trade
      wallet.balance = tradeType.toLowerCase() === 'buy'
        ? wallet.balance - totalCost
        : wallet.balance + totalCost;
  
      await wallet.save();
  
      // Create the trade record
      const trade = await Trade.create({
        userId,
        signalId,
        amount,
        units,
        interval,
        direction: tradeType.toLowerCase(),
        leverage,
        startTime: new Date(),
        processed: false,
        status: 'ongoing',
        profit: 0
      });
  
      res.json({ message: 'Trade executed successfully', trade });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
};

const getAllTrades = async (req, res) => {
    try {
        const trades = await Trade.find().sort({ createdAt: -1 });
        const tradesWithSignals = await Promise.all(trades.map(async (trade) => {
            const signal = await Signal.findById(trade.signalId);
            return {
                ...trade.toObject(),
                signalDetails: signal
            };
        }));
        res.json(tradesWithSignals);
        // res.json(trades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const tradeOutcome = async (req, res) => {
    const { tradeId, userId, signalId, status, profit } = req.body;
    
    try {
        
        const trade = await Trade.findById(tradeId);
        
        // Check if trade exists
        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }

        // Check if trade is already processed
        if (trade.processed) {
            return res.status(400).json({ message: 'Trade outcome already processed' });
        }

        // Check for the Signal 
        const signal = await Signal.findById(signalId);
        if (!signal) {
            return res.status(404).json({ message: 'Signal not found' });
        }

        // determine the trade outcome 
        if (trade.direction.toLowerCase() !== signal.direction.toLowerCase()) {
            status = 'loss';
            profit = -Math.abs(profit); // Ensure profit is negative for a loss
        }

        // Calculate profit/loss based on leverage
        const profit = (trade.leverage / 100) * trade.amount * (outcome === 'win' ? 1 : -1);

        // Update Customer Wallet Balance
        const wallet = await Wallet.findOne({ userId: userId });
        wallet.balance += profit;
  
        trade.status = status;
        trade.profit = profit;
        trade.processed = true;
  
        await trade.save();
    
        res.json({ message: 'Trade outcome processed successfully', trade });

    } catch (error) {

        res.status(500).json({ message: 'Internal Server Error', error });

    }
}

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
    getAllMarkets,
    createTrade,
    getAllTrades,
    tradeOutcome
};
