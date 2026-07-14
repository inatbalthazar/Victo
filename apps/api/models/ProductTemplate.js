const mongoose = require('mongoose');

const productTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  style: { type: String, enum: ['tee', 'hoodie', 'sweatshirt'], required: true },
  color: {
    hex: String,
    name: String
  },
  views: {
    front: { type: String, default: '' },
    back: { type: String, default: '' },
    left: { type: String, default: '' },
    right: { type: String, default: '' }
  },
  preview_image: { type: String, default: '' },
  create_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProductTemplate', productTemplateSchema, 'product_templates');
