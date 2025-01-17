const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  walletType: { type: String, enum: ['fiat', 'crypto'], required: true }, // e.g., USD, BTC
  balance: { type: Number, default: 0 },
  currency: { type: String, required: true }, // USD, EUR, BTC, ETH, etc.
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wallet', walletSchema);
walletSchema.pre('save', function(next) {
    if (!this.isNew) {
        return next();
    }
    this._id = uuidv4();
    next();
});