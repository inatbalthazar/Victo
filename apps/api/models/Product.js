const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['apparel', 'trophy', 'medal', 'wristband', 'badge'], required: true },
  base_price: { type: mongoose.Schema.Types.Decimal128, required: true },
  description: String,
  image: String,
  is_active: { type: Boolean, default: true },
  create_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema, 'products');
