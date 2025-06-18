const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'manager', 'developer'], default: 'developer' }
});

module.exports = mongoose.model('User', userSchema);
