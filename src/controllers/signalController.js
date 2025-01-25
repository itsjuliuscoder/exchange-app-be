const User = require('../models/User');
const Signal = require('../models/Signal');
const Wallet = require('../models/Wallet');
const Asset = require('../models/Asset');

// Create a new trade
const createSignal = async (req, res) => {
    const { userId, symbol, direction, amount, units, interval } = req.body;

    console.log("req.body -->", req.body);

    try {

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const walletType = direction === 'buy' ? 'fiat' : 'crypto';
        console.log("walletType -->", walletType);
        const wallet = await Wallet.findOne({ userId, walletType });

        console.log("wallet -->", wallet);

        // Create the trade record
        const signal = await Signal.create({
            userId,
            symbol,
            direction,
            amount,
            units: parseInt(units),
            interval
        });

        res.json({ message: 'Signal executed successfully', signal });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}

const getAllSignals = async (req, res) => {
    try {
        const signals = await Signal.find().sort({ createdAt: -1 });
        res.json(signals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update trade outcome
const tradeOutcome = async (req, res) => {
    const { tradeId } = req.params;
    const { outcome, profit } = req.body;

    try {
        const trade = await Signal.findById(tradeId);
        if (!trade) return res.status(404).json({ message: 'Trade not found' });

        trade.status = outcome;
        trade.profit = profit || 0;
        await trade.save();

        res.status(200).json({ message: 'Trade updated successfully', trade });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
}

// Update asset value
const updateAssetValue = async (req, res) => {
    const { symbol } = req.params;
    const { currentValue } = req.body;

    try {
        let asset = await Asset.findOne({ symbol });
        if (!asset) {
            asset = new Asset({ symbol, currentValue });
        } else {
            asset.currentValue = currentValue;
        }
        await asset.save();

        res.status(200).json({ message: 'Asset value updated', asset });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}


module.exports = { createSignal, tradeOutcome, updateAssetValue, getAllSignals };