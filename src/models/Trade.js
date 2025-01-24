const mongoose = require('mongoose');

// Trade Schema
const tradeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    signalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Signal' },
    amount: Number,
    units: Number,
    interval: { type: Number, required: true }, // In minutes
    direction: { type: String, enum: ['buy', 'sell'], required: true },
    leverage: { type: Number, required: true },
    startTime: { type: Date, required: true, default: Date.now },
    processed: { type: Boolean, default: false },
    status: { type: String, enum: ['ongoing', 'win', 'loss'], default: 'ongoing' },
    profit: { type: Number, default: 0 }
});
  
const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;