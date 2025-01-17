const mongoose = require('mongoose');

// Trade Schema
const signalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    symbol: String,
    amount: Number,
    units: Number,
    interval: String,
    direction: { type: String, enum: ['buy', 'sell'], default: 'buy' },
    profit: Number,
    status: { type: String, enum: ['ongoing', 'win', 'loss'], default: 'ongoing' },
});
  
const Signal = mongoose.model('Signal', signalSchema);

module.exports = Signal;