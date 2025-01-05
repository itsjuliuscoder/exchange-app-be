const { body, query, validationResult } = require('express-validator');
const User = require('../models/User'); // Assuming you have a User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const emailService = require('../services/emailService'); // Assuming emailService is in the same directory
const crypto = require('crypto');


const generate2FACode = () => {
    return crypto.randomBytes(3).toString('hex'); // Generates a 6-character hex code
};

/**
 * Registers a new user.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.email - User's email.
 * @param {string} req.body.password - User's password.
 * @param {string} req.body.name - User's name.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with a success message or error message.
 */
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log(req.body);

  const { email, password, name, accountType } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name, accountType });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await emailService.verifyUserEmail(email, token);

    const userResponse = { email: newUser.email, name: newUser.name, isVerified: newUser.isVerified, accountType: newUser.accountType };
    res.status(201).json({ message: 'User registered successfully', user: userResponse });
  
} catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const twoFACode = generate2FACode();
      user.twoFACode = twoFACode;
      user.twoFACodeExpires = Date.now() + 10 * 60 * 1000; // Code expires in 10 minutes
      await user.save();
  
      await emailService.send2FACode(email, twoFACode);
  
      res.status(200).json({ message: '2FA code sent to email' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
};

const verifyEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const token = req.query.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const refreshToken = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await emailService.resetPasswordEmail(email, token);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.query;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const verify2FA = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }

    const { email, code } = req.body;

    try {
    const user = await User.findOne({ email });
    if (!user || user.twoFACode !== code || user.twoFACodeExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired 2FA code' });
    }

    user.twoFACode = undefined;
    user.twoFACodeExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const validate = (method) => {
    switch (method) {
      case 'register': {
        return [
          body('email').isEmail().withMessage('Invalid email'),
          body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
          body('name').not().isEmpty().withMessage('Name is required'),
          body('accountType').not().isEmpty().withMessage('Account type is required'),
        ];
      }
      case 'login': {
        return [
          body('email').isEmail().withMessage('Invalid email'),
          body('password').not().isEmpty().withMessage('Password is required'),
        ];
      }
      case 'verifyEmail': {
        return [
          query('token').not().isEmpty().withMessage('Token is required'),
        ];
      }
      case 'updatePassword': {
        return [
          query('token').not().isEmpty().withMessage('Token is required'),
          body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        ];
      }
      case 'refreshToken': {
        return [
          body('token').not().isEmpty().withMessage('Token is required'),
        ];
      }
      case 'resetPassword': {
        return [
          body('email').isEmail().withMessage('Invalid email'),
        ];
      }
      case 'verify2FA': {
        return [
          body('email').isEmail().withMessage('Invalid email'),
          body('code').not().isEmpty().withMessage('2FA code is required'),
        ];
      }
    }
};

module.exports = {
  register,
  login,
  verifyEmail,
  refreshToken,
  resetPassword,
  validate,
  verify2FA,
  updatePassword
};