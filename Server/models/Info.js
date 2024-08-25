const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
  ibanNumber: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber1: {
    type: String,
  },
  phoneNumber2: {
    type: String,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
  },
  delivery: {
    type: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model('Info', infoSchema);
