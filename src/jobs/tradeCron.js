const cron = require('node-cron');
const Trade = require('../models/Trade');
const { callTradeOutcomeAPI } = require('../services/tradeService');

// Start cron job for processing trades
function startTradeCronJob() {
  cron.schedule('* * * * *', async () => {
    console.log('Checking for trades to process:', new Date());
    
    try {
      const now = new Date();

      // Find trades where the interval has elapsed and are not yet processed
      const trades = await Trade.find({
        processed: false,
        $expr: {
          $gte: [
            now,
            {
              $add: ['$startTime', { $multiply: ['$interval', 60000] }], // Add interval in milliseconds
            },
          ],
        },
      });

      for (const trade of trades) {
        // Simulate random status
        const status = Math.random() > 0.5 ? 'win' : 'loss';
        const profit = (trade.leverage / 100) * trade.amount * (status === 'win' ? 1 : -1);

        // Call Trade status API
        await callTradeOutcomeAPI({
          ...trade.toObject(),
          status,
          profit,
        });

        // Update trade as processed
        trade.status = status;
        trade.profit = profit;
        trade.processed = true;
        await trade.save();

        console.log(`Processed trade: ${trade.tradeId}`);
      }
    } catch (error) {
      console.error('Error processing trades:', error.message);
    }
  });

  console.log('Trade cron job started!');
}

module.exports = startTradeCronJob;
