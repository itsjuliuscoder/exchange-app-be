const Wallet = require('../models/Wallet');
const User = require('../models/User');

exports.createWallet = async (req, res) => {
  try {
    const { userId, walletType, currency } = req.body;

    //console.log("req body -->", req.body);

    // Validate user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    //console.log("user login --> ", user);
    // Check if the wallet already exists for the given user and currency
    const existingWallet = await Wallet.findOne({ userId, currency, walletType });
    if (existingWallet) {
      return res.status(400).json({ message: 'Wallet already exists.' });
    }

    const newWallet = new Wallet({
      userId,
      walletType,
      currency,
      balance: 0, // Start with zero balance
    });

    await newWallet.save();
    res.json({ message: 'Wallet created successfully.', wallet: newWallet });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWalletBalance = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Find wallet by userId
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found.' });
    }

    // Update wallet balance
    wallet.balance += parseInt(amount);
    await wallet.save();

    res.status(200).json({ message: 'Wallet balance updated successfully!', wallet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWalletBalanceManual = async (req, res) => {
  try {
    const { userId, amount, transType } = req.body;

    console.log("this is req body details --> ", req.body)

    // Find wallet by userId
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found.' });
    }
    if (transType === 'debit') {
      if (wallet.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance.' });
      }
      wallet.balance -= parseInt(amount);
    } else if (transType === 'credit') {
      wallet.balance += parseInt(amount);
    } else {
      return res.status(400).json({ message: 'Invalid transaction type.' });
    }
    
    await wallet.save();

    res.status(200).json({ message: 'Wallet balance updated successfully!', wallet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listAllWallets = async (req, res) => {
  try {
    const { userId } = req.params; // Assume authentication middleware sets req.user.id
    const wallets = await Wallet.find({ userId }).lean();
    if(!wallets || wallets.length === 0) {
      return res.status(404).json({ message: 'No wallets found.' });
    }
    res.json(wallets);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error ' +  err.message });
  }
}

exports.getWalletByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOne({ userId }).lean();

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found.' });
    }
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    wallet.user = user;
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
