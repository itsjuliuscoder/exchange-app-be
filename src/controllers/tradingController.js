const alphaVantageService = require('../services/alphaVantageService');

const getQuote = async (req, res) => {
  const { symbol } = req.params;

  try {
    const quote = await alphaVantageService.getStockQuote(symbol);
    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock quote' });
  }
};

const getIntraday = async (req, res) => {
  const { symbol, interval } = req.params;

  try {
    const data = await alphaVantageService.getIntradayData(symbol, interval);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching intraday data' });
  }
};

const getDaily = async (req, res) => {
  const { symbol } = req.params;

  try {
    const data = await alphaVantageService.getDailyData(symbol);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily data' });
  }
};

module.exports = {
  getQuote,
  getIntraday,
  getDaily,
};