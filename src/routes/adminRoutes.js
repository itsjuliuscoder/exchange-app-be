const express = require('express');
const { createAdmin, blockUser, editBalance, getAdminStats, getAllUsers, getUserById, 
    getTotalTransactions, getTotalDepositTrans, getTotalWidthdrawalTrans, getTotalRequestedWithdrawalTrans} = require('../controllers/adminController');
const { checkAdmin } = require('../middlewares/checkAdmin');

const router = express.Router();

// Route to create a new admin (protected)
router.post('/create-admin', createAdmin);
router.patch('/block-user/:userId', blockUser);
router.patch('/edit-balance/:userId', checkAdmin, editBalance);
router.get('/get-stats', getAdminStats);
router.put('/block-user/:userId', blockUser);
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.get('/get-total-transaction', getTotalTransactions);
router.get('/get-total-deposit-trans', getTotalDepositTrans);
router.get('/get-total-widthrawal-trans', getTotalWidthdrawalTrans);
router.get('/get-pending-withdrawal', getTotalRequestedWithdrawalTrans);

module.exports = router;
