const mongoose = require('mongoose');

const customizationSchema = new mongoose.Schema({
  selected_size: String,
  uploaded_image_url: String,
  custom_text: String,
  additional_note: String
}, { _id: false });

const verifyHistorySchema = new mongoose.Schema({
  admin_id: mongoose.Schema.Types.ObjectId,
  status: String,
  admin_comment: String,
  reviewed_at: Date
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  product_id: mongoose.Schema.Types.ObjectId,
  product_name: String,
  category: { type: String, enum: ['apparel', 'trophy', 'medal', 'wristband', 'badge'] },
  quantity: Number,
  unit_price: mongoose.Schema.Types.Decimal128,
  verify_status: { type: String, enum: ['pending', 'approved', 'rejected_illegal', 'rejected_low_quality'] },
  customization: customizationSchema,
  verify_history: [verifyHistorySchema]
}, { _id: false });

const orderSchema = new mongoose.Schema({
  order_number: { type: String, required: true, unique: true },
  order_status: { type: String, enum: ['pending_review', 'processing', 'printing_3d', 'shipped', 'delivered', 'cancelled'], required: true },
  customer_snapshot: {
    user_id: mongoose.Schema.Types.ObjectId,
    username: String,
    email: String,
    phone_number: String
  },
  shipping_address_snapshot: {
    recipient_name: String,
    recipient_phone: String,
    address_line1: String,
    address_line2: String,
    sub_district: String,
    district: String,
    province: String,
    postal_code: String
  },
  financials: {
    total_amount: mongoose.Schema.Types.Decimal128,
    shipping_fee: mongoose.Schema.Types.Decimal128,
    net_amount: mongoose.Schema.Types.Decimal128,
    payment_status: { type: String, enum: ['pending', 'paid', 'failed'] },
    payment_method: String,
    transaction_ref: String,
    paid_at: Date
  },
  tracking_number: String,
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  items: [orderItemSchema]
});

module.exports = mongoose.model('Order', orderSchema, 'orders');
