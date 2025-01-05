const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const authRouter = require('./routes/authRoutes');
const tradeRouter = require('./routes/tradeRoutes');
const tradingRouter = require('./routes/tradingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/trades', tradeRouter);
app.use('/api/trading', tradingRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Polygon API' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
