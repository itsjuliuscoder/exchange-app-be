const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TradeSchema = new Schema({
    symbol: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    tradeDate: {
        type: Date,
        default: Date.now
    },
    tradeType: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
    }
});

module.exports = mongoose.model('Trade', TradeSchema);