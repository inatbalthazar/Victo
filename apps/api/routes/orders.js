const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.order_status = status;
    if (search) filter.order_number = { $regex: search, $options: 'i' };
    const orders = await Order.find(filter).sort({ create_at: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { order_status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { order_status, update_at: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customer_snapshot, shipping_address_snapshot, financials, items } = req.body;
    
    // Generate order number like ORD-20260714-X1Y2
    const now = new Date();
    const dateStr = now.getFullYear() + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0');
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const order_number = `ORD-${dateStr}-${rand}`;
    
    const newOrder = new Order({
      order_number,
      order_status: 'pending_review',
      customer_snapshot,
      shipping_address_snapshot,
      financials,
      items
    });
    
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
