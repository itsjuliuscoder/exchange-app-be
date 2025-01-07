const express = require('express');
const { getAdminDashboard, manageUsers, createAdmin, updateAdmin, manageTransactions } = require('../controllers/adminController');

const router = express.Router();

// Controller functions

// Admin dashboard route
router.get('/dashboard', getAdminDashboard);

// Manage users route
router.get('/users', manageUsers);

// Manage transactions route
router.get('/transactions', manageTransactions);

router.post('/create-admin', createAdmin);

router.put('/update-admin/:id', updateAdmin);   

module.exports = router;