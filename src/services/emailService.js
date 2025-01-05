const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

const verifyUserEmail = (to, token) => {
  const subject = 'Verify your email';
  const text = `Please verify your email by clicking the following link: ${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
  return sendMail(to, subject, text);
};

const resetPasswordEmail = (to, token) => {
  const subject = 'Reset your password';
  const text = `You can reset your password by clicking the following link: ${process.env.BASE_URL}/reset-password?token=${token}`;
  return sendMail(to, subject, text);
};

const welcomeNewUserEmail = (to) => {
  const subject = 'Welcome to our service';
  const text = 'Thank you for signing up for our service!';
  return sendMail(to, subject, text);
};

const notificationEmail = (to, message) => {
  const subject = 'Notification';
  const text = message;
  return sendMail(to, subject, text);
};

const send2FACode = (to, code) => {
    const subject = 'Your 2FA Code';
    const text = `Your 2FA code is: ${code}`;
    return sendMail(to, subject, text);
};

module.exports = {
  verifyUserEmail,
  resetPasswordEmail,
  welcomeNewUserEmail,
  notificationEmail,
  send2FACode
};