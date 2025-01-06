const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, required: true },
  transactionHash: { type: String, unique: true, required: true },
  blockNumber: { type: Number },
  gasUsed: { type: String },
  status: { type: Boolean },
  type: { type: String, enum: ["deposit", "tranfer", "withdraw"] },
  timestamp: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
