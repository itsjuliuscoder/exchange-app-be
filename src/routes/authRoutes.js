const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');

router.post('/register', authControllers.validate('register'), authControllers.register);
router.post('/login', authControllers.validate('login'), authControllers.login);
router.post('/verify-email', authControllers.validate('verifyEmail'), authControllers.verifyEmail);
router.post('/refresh-token', authControllers.validate('refreshToken'), authControllers.refreshToken);
router.post('/reset-password', authControllers.validate('resetPassword'), authControllers.resetPassword);

module.exports = router;