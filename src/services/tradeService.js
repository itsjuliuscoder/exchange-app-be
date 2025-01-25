const axios = require('axios');

// Simulate Trade Outcome API call
async function callTradeOutcomeAPI(trade) {
  const leverageFactor = trade.leverage / 100; // Convert leverage to decimal
  const profit = leverageFactor * trade.amount * (trade.status === 'win' ? 1 : -1);

  const payload = {
    tradeId: trade.tradeId,
    userId: trade.userId,
    status: trade.status,
    profit,
  };
  
  try {
    // Replace this URL with your actual API endpoint
    const response = await axios.post('http://localhost:5001/api/trading/outcome', payload);
    return response.data;
  } catch (error) {
    console.error(`Failed to execute trade outcome for trade ID: ${trade.tradeId}`, error.message);
  }
}

module.exports = { callTradeOutcomeAPI };
