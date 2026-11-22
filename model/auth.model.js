// Auth oldingi darslarda yozilgan (videoda to'liq ko'rsatilmagan) — protect/adminOnly ishlashi uchun oddiy versiya
const mongoose = require('mongoose');

const userModel = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userModel);
