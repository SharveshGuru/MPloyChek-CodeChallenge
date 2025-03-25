const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  accessLevel: { type: String, enum: ['Admin', 'General'], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Record', recordSchema);
