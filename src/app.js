const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const authRouter = require('./routes/authRoutes');
const signalRouter = require('./routes/signalRoutes');
const tradingRouter = require('./routes/tradingRoutes');
const adminRouter = require('./routes/adminRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const walletRouter = require('./routes/walletRoutes');
// const startEmailCronJob = require('./jobs/emailCron');
const startTradeCronJob = require('./jobs/tradeCron');

const app = express();

// startEmailCronJob();
startTradeCronJob();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Connect to the database
connectDB();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/signal', signalRouter);
app.use('/api/trading', tradingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/wallet', walletRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Polygon API' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});


module.exports = app;
