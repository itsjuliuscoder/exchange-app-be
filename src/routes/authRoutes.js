const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');

router.post('/register', authControllers.validate('register'), authControllers.register);
router.post('/login', authControllers.validate('login'), authControllers.login);
router.get('/verify-email', authControllers.validate('verifyEmail'), authControllers.verifyEmail);
router.post('/refresh-token', authControllers.validate('refreshToken'), authControllers.refreshToken);
router.post('/reset-password', authControllers.validate('resetPassword'), authControllers.resetPassword);
router.post('/verify-2fa', authControllers.validate('verify2FA'), authControllers.verify2FA);
router.post('/update-password', authControllers.validate('updatePassword'), authControllers.updatePassword);

module.exports = router;