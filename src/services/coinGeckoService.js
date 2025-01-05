const axios = require('axios');

const baseUrl = 'https://api.coingecko.com/api/v3';


const getCoinData = async (coinId) => {
  try {
    const response = await axios.get(`${baseUrl}/coins/${coinId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching coin data:', error);
    throw error;
  }
};

const getMarketData = async (vsCurrency = 'usd', ids = '') => {
  try {
    const response = await axios.get(`${baseUrl}/coins/markets`, {
      params: {
        vs_currency: vsCurrency,
        ids,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

const getHistoricalData = async (coinId, date) => {
  try {
    const response = await axios.get(`${baseUrl}/coins/${coinId}/history`, {
      params: {
        date,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

const getAllCoins = async () => {
    try {
        const response = await axios.get(`${baseUrl}/coins/list`, {
        headers: {
            accept: 'application/json',
        },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching all coins:', error);
        throw error;
    }
};

const getAllMarkets = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        headers: {
            accept: 'application/json',
        },
        params: {
            vs_currency: 'usd', // Specify the currency for market data
        },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching all markets:', error);
        throw error;
    }
}

module.exports = {
  getCoinData,
  getMarketData,
  getHistoricalData,
  getAllCoins,
  getAllMarkets
};