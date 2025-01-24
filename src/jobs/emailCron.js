const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email content
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'devcalledjulius@gmail.com',
  subject: 'Motivational Message',
  text: `Hi Julius,

I just want you to know how great you are. You are a wonderful person and your challenges don't define you. Well done and keep pushing, the dots will surely connect.

Best Regards,`,
};

// Start cron job for sending email
function startEmailCronJob() {
  cron.schedule('*/30 * * * *', async () => {
    console.log('Sending motivational email:', new Date());

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
  });

  console.log('Email cron job started!');
}

module.exports = startEmailCronJob;