// models/SliderImage.js
const mongoose = require('mongoose');

const SliderImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SliderImage', SliderImageSchema);
