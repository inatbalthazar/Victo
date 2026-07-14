const express = require('express');
const router = express.Router();
const ProductTemplate = require('../models/ProductTemplate');

// List templates for a specific user
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: 'user_id query parameter is required' });
    const templates = await ProductTemplate.find({ user_id }).sort({ create_at: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get details of a single template
router.get('/:id', async (req, res) => {
  try {
    const template = await ProductTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or Update a template
router.post('/', async (req, res) => {
  try {
    const { id, name, user_id, style, color, views, preview_image } = req.body;
    if (!name || !user_id || !style) {
      return res.status(400).json({ error: 'name, user_id, and style are required' });
    }

    if (id) {
      // Update existing template
      const updated = await ProductTemplate.findByIdAndUpdate(
        id,
        { name, style, color, views, preview_image },
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Template not found' });
      return res.json(updated);
    } else {
      // Create new template
      const newTemplate = new ProductTemplate({
        name,
        user_id,
        style,
        color,
        views,
        preview_image
      });
      await newTemplate.save();
      return res.status(201).json(newTemplate);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a template
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ProductTemplate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Template not found' });
    res.json({ message: 'Template deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
