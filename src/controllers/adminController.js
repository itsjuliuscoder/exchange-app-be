const User = require('../models/User');
const bcrypt = require('bcrypt');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin account
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin account created successfully!', data: newAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.blockUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.blocked = !user.blocked;
      await user.save();
  
      res.json({ message: `User ${user.blocked ? 'blocked' : 'unblocked'} successfully.` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
exports.editBalance = async (req, res) => {
    try {
        const { userId } = req.params;
        const { newBalance } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.balance = newBalance;
        await user.save();

        res.json({ message: 'User balance updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDeposits = await Transaction.aggregate([
          { $match: { type: 'deposit', status: 'approved' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const totalWithdrawals = await Transaction.aggregate([
          { $match: { type: 'withdrawal', status: 'approved' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
    
        res.json({
          num_users: totalUsers,
          totalDeposits: totalDeposits[0]?.total || 0,
          totalWithdrawals: totalWithdrawals[0]?.total || 0,
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

exports.getBlockedUsers = async (req, res) => {
    try {
        const users = await User.find({ blocked: true });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers, users });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.getUserById = async (req, res) => {
  try {
    
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
    res.json({ user, wallet });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
