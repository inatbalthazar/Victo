const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const { category, search, active } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (active !== undefined) filter.is_active = active === 'true';
    if (search) filter.name = { $regex: search, $options: 'i' };
    const products = await Product.find(filter).sort({ create_at: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
