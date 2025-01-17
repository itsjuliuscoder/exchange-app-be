const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    accountType: {
      type: String,
      enum: ["Retail", "Premium"],
      default: "Retail",
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: { type: Boolean, default: false }, // Indicates admin role
    //balance: { type: Number, default: 0 },
    referredBy: { type: String }, // email or account number of referrer
    referralCode: { type: String },
    blocked: { type: Boolean, default: false },
    twoFACode: {
      type: String,
    },
    twoFACodeExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
