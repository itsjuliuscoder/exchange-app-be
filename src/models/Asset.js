const mongoose = require('mongoose');

// Asset Schema
const assetSchema = new mongoose.Schema({
    symbol: String,
    currentValue: Number
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;