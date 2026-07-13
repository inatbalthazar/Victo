const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  addr_id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  recv_name: String,
  recv_phone: String,
  addr_detail: String,
  sub_district: String,
  district: String,
  province: String,
  zip: String,
  is_default: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pwd: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true },
  roles: { type: [String], enum: ['customer', 'admin', 'super_admin'], required: true },
  addr: [addressSchema],
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema, 'users');
