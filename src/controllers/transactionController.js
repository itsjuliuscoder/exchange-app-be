const Transaction = require('../models/Transaction');
const uploadFile = require('../services/fileUploadService');
const Wallet = require('../models/Wallet');

exports.createTransaction = async (req, res) => {
  try {

    const { userId, walletId, type, amount } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: "Proof of transaction is required" });
    }

    // Find the wallet
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found.' });
    }

    // Upload file to Cloudinary
    const result = await uploadFile(req.file.buffer, `transactions/${userId}`);

    // console.log(`response from cloudinary ${result} & url ${result.secure_url}`);

    // Generate a unique transaction hash (e.g., using a UUID)
    const transactionHash = require('crypto').randomBytes(16).toString('hex');

    // Create new transaction
    const transaction = new Transaction({
      userId,
      walletId,
      type,
      amount,
      proof: result.secure_url, // Cloudinary URL
      transactionHash
    });

    // Save transaction
    await transaction.save();

    res.status(201).json({ message: 'Transaction created successfully.', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
    try {
      const { walletId } = req.params;
      const transactions = await Transaction.find({ walletId });
  
      res.status(200).json({ transactions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
        const { transactionId, status } = req.body;

        // Validate status
        if (!['approved', 'declined'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }

        // Find transaction
        const transaction = await Transaction.findById(transactionId).populate('walletId');
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        // Update transaction status
        transaction.status = status;
        await transaction.save();

        // If approved, update wallet balance
        if (status === 'approved') {
            if (transaction.type === 'deposit') {
                transaction.walletId.balance += transaction.amount;
            } else if (transaction.type === 'withdrawal') {
                transaction.walletId.balance -= transaction.amount;
            }
            await transaction.walletId.save();
        }

        res.status(200).json({ message: `Transaction ${status} successfully.`, transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.depositTransaction = async (req, res) => {
    try {
        const { userId, walletId, amount, proof } = req.body;

        // Find the wallet
        const wallet = await Wallet.findById(walletId);
        if (!wallet) return res.status(404).json({ message: 'Wallet not found.' });

        const depositTransaction = new Transaction({
            userId,
            walletId,
            type: 'deposit',
            amount,
            proof,
        });

        await depositTransaction.save();
        res.json({ message: 'Deposit request created.', transaction: depositTransaction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.withdrawTransaction = async (req, res) => {
    try {
        const { userId, walletId, amount } = req.body;
    
        // Find the wallet
        const wallet = await Wallet.findById(walletId);
        if (!wallet) return res.status(404).json({ message: 'Wallet not found.' });
    
        if (wallet.balance < amount) return res.status(400).json({ message: 'Insufficient balance.' });

        // Generate a unique transaction hash (e.g., using a UUID)
        const transactionHash = require('crypto').randomBytes(16).toString('hex');
    
        const withdrawalTransaction = new Transaction({
          userId,
          walletId,
          type: 'withdrawal',
          amount,
          transactionHash
        });
        
        await withdrawalTransaction.save();
        res.json({ message: 'Withdrawal request created.', transaction: withdrawalTransaction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });
    
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.approveTransactionDeposit = async (req, res) => {

    const { transactionId, status } = req.body;

    try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });

        if (status === 'approved') {
            const wallet = await Wallet.findById(transaction.walletId);
            wallet.balance += transaction.amount; // Add amount to wallet balance
            await wallet.save();
        }
        transaction.status = status;
        await transaction.save();
        res.json({ message: 'Transaction updated successfully.' });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

exports.approveTransactionWithdrawal = async (req, res) => {

    const { transactionId, status } = req.body;

    try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });

        if (status === 'approved') {
            const wallet = await Wallet.findById(transaction.walletId);
            if (wallet.balance < transaction.amount) return res.status(400).json({ message: 'Insufficient funds.' });
            
            wallet.balance -= transaction.amount; // Deduct amount from wallet balance
            await wallet.save();
        }

        transaction.status = status;
        await transaction.save();
        res.json({ message: 'Transaction updated successfully.' });

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

}

exports.declineTransactionDeposit = async (req, res) => {
    
    const { transactionId } = req.body;

    try {
        // Find the transaction by ID
        const transaction = await Transaction.findById(transactionId);
            if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        // Update transaction status to declined
        transaction.status = 'declined';
        await transaction.save();

        // Return success response
        res.json({ message: 'Deposit transaction has been declined.' });

    } catch (err) {

        res.status(500).json({ error: err.message });

    }
}

exports.declineTransactionWithdrawal = async (req, res) => {
    
    const { transactionId } = req.body;

    try {
        // Find the transaction by ID
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        // Update transaction status to declined
        transaction.status = 'declined';
        await transaction.save();

        // Return success response
        res.json({ message: 'Withdrawal transaction has been declined.' });

    } catch (err) {
        
        res.status(500).json({ error: err.message });

    }

}

exports.getTotalWithdrawals = async (req, res) => {
    try {
        const totalWithdrawals = await Transaction.aggregate([
            { $match: { type: 'withdrawal', status: 'approved' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        res.json({ totalWithdrawals: totalWithdrawals[0]?.total || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getTotalDeposits = async (req, res) => {
    try {
        const totalDeposits = await Transaction.aggregate([
            { $match: { type: 'deposit', status: 'approved' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        res.json({ totalDeposits: totalDeposits[0]?.total || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getWithdrawalRequests = async (req, res) => {
    try {
        const withdrawalRequests = await Transaction.find({ type: 'withdrawal', status: 'pending' });
        const count = await Transaction.countDocuments({ type: 'withdrawal', status: 'pending' });
        res.json({ withdrawal: withdrawalRequests, totalCount: count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}




  


  
