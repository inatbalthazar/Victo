const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

router.get('/stats', async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, ordersByStatus, revenue] = await Promise.all([
      Product.countDocuments({ is_active: true }),
      Order.countDocuments(),
      User.countDocuments({ roles: 'customer' }),
      Order.aggregate([
        { $group: { _id: '$order_status', count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { 'financials.payment_status': 'paid' } },
        { $group: { _id: null, total: { $sum: { $toDouble: '$financials.net_amount' } } } }
      ])
    ]);

    const statusMap = {};
    ordersByStatus.forEach(s => { statusMap[s._id] = s.count; });

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: revenue[0]?.total || 0,
      ordersByStatus: statusMap
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
