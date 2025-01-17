const mongoose = require('mongoose');

// Trade Schema
const tradeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    signalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Signal' },
    amount: Number,
    units: Number,
    interval: String,
    direction: String,
    status: { type: String, enum: ['ongoing', 'win', 'loss'], default: 'ongoing' },
});
  
const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;