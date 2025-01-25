const cron = require('node-cron');
const Trade = require('../models/Trade');
const { callTradeOutcomeAPI } = require('../services/tradeService');
const Signal = require('../models/Signal');
const Wallet = require('../models/Wallet');

// Start cron job for processing trades
// function startTradeCronJobOld() {let 
//   cron.schedule('* * * * *', async () => {
//     console.log('Checking for trades to process:', new Date());
    
//     try {
//       const now = new Date();

//       // Find trades where the interval has elapsed and are not yet processed
//       const trades = await Trade.find({
//         processed: false,
//         $expr: {
//           $gte: [
//             now,
//             {
//               $add: ['$startTime', { $multiply: ['$interval', 60000] }], // Add interval in milliseconds
//             },
//           ],
//         },
//       });

//       for (const trade of trades) {
//         // Simulate random status
//         const status = Math.random() > 0.5 ? 'win' : 'loss';
//         const profit = (trade.leverage / 100) * trade.amount * (status === 'win' ? 1 : -1);

//         // Call Trade status API
//         await callTradeOutcomeAPI({
//           ...trade.toObject(),
//           status,
//           profit,
//         });

//         // Update trade as processed
//         trade.status = status;
//         trade.profit = profit;
//         trade.processed = true;
//         await trade.save();

//         console.log(`Processed trade: ${trade.tradeId}`);
//       }
//     } catch (error) {
//       console.error('Error processing trades:', error.message);
//     }
//   });

//   console.log('Trade cron job started!');
// }

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
        // Check for the Signal
        const signal = await Signal.findById(trade.signalId);
        if (!signal) {
          console.error(`Signal not found for trade: ${trade._id}`);
          continue;
        }

        console.log(`Processing trade for this id ${trade._id}`);

        let status;

        // determine the trade outcome 
        if (trade.direction.toLowerCase() !== signal.direction.toLowerCase()) {
            status = 'loss';
            // profit = -Math.abs(profit); // Ensure profit is negative for a loss
        } else {
            status = 'win'
        }

        console.log("this is status", status);

        // Ensure leverage and amount are valid numbers
        if (isNaN(trade.leverage) || isNaN(trade.amount)) {
          console.error(`Invalid leverage or amount for trade: ${trade._id}, leverage is ${trade.leverage} and amount ${trade.amount}`);
          continue;
        }

        // Calculate profit/loss based on leverage
        const profit = ((trade.leverage / 100) * trade.amount * (status === 'win' ? 1 : -1));

        console.log("this is profit", profit);

        // Update Customer Wallet Balance
        const wallet = await Wallet.findOne({ userId: trade.userId });
        if (wallet) {
          wallet.balance += profit;
          await wallet.save();
        } else {
          console.error(`Wallet not found for user: ${trade.userId}`);
          continue;
        }

        // Update trade as processed
        trade.status  = status;
        trade.profit = profit;
        trade.processed = true;
        await trade.save();

        console.log(`Processed trade: ${trade._id} was successful`);
      }
    } catch (error) {
      console.error('Error processing trades:', error.message);
    }
  });

  console.log('Trade cron job started!');
}

module.exports = startTradeCronJob;
