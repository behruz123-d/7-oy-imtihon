const mongoose = require('mongoose');

const categoryModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false
  },
);

module.exports = mongoose.model('category', categoryModel);
