const axios = require('axios');
require('dotenv').config();

const alphaVantageApiKey = process.env.ALPHA_VANTAGE_API_KEY;
const baseUrl = 'https://www.alphavantage.co/query';

const getStockQuote = async (symbol) => {
  try {
    const response = await axios.get(baseUrl, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: alphaVantageApiKey,
      },
    });
    return response.data['Global Quote'];
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
};

const getIntradayData = async (symbol, interval = '5min') => {
  try {
    const response = await axios.get(baseUrl, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval,
        apikey: alphaVantageApiKey,
      },
    });
    return response.data[`Time Series (${interval})`];
  } catch (error) {
    console.error('Error fetching intraday data:', error);
    throw error;
  }
};

const getDailyData = async (symbol) => {
  try {
    const response = await axios.get(baseUrl, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        apikey: alphaVantageApiKey,
      },
    });
    return response.data['Time Series (Daily)'];
  } catch (error) {
    console.error('Error fetching daily data:', error);
    throw error;
  }
};

async function getExchangeRate(fromCurrency, toCurrency) {
    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: "CURRENCY_EXCHANGE_RATE",
          from_currency: fromCurrency,
          to_currency: toCurrency,
          apikey: API_KEY,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
}
    

module.exports = {
  getStockQuote,
  getIntradayData,
  getDailyData,
  getExchangeRate
};