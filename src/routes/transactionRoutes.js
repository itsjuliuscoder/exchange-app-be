const express = require('express');
const transactionController = require('../controllers/transactionController');

const router = express.Router();


router.post('/create', transactionController.createTransaction);

// Route to get all transactions
//router.get('/', transactionController.getAllTransactions);

// Route to get a single transaction by ID
//router.get('/:id', transactionController.getTransactionById);

// Route to create a new transaction
//router.post('/create-trans', transactionController.createTransaction);

// Route to update a transaction by ID
//router.post('/update-status', transactionController.updateTransactionStatus);

// Route to delete a transaction by ID
//router.delete('/:id', transactionController.deleteTransaction);

//router.post('/approve-withdrawal', transactionController.approveTransactionWithdrawal);

//router.post('/decline-withdrawal', transactionController.declineTransactionWithdrawal);

//router.post('/approve-deposit', transactionController.approveTransactionDeposit);

//router.post('/decline-deposit', transactionController.declineTransactionDeposit);

module.exports = router;