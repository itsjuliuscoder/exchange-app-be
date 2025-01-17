const express = require('express');
const { createAdmin, blockUser, editBalance, getAdminStats, getAllUsers, getUserById} = require('../controllers/adminController');
const { checkAdmin } = require('../middlewares/checkAdmin');

const router = express.Router();

// Route to create a new admin (protected)
router.post('/create-admin', createAdmin);
router.patch('/block-user/:userId', checkAdmin, blockUser);
router.patch('/edit-balance/:userId', checkAdmin, editBalance);
router.get('/get-stats', getAdminStats);
router.put('/block-user/:userId', blockUser);
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);

module.exports = router;
