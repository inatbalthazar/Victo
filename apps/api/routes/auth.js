const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  try {
    const { email, pwd } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Email not found' });
    if (user.pwd !== pwd) return res.status(401).json({ error: 'Wrong password' });
    res.json({
      _id: user._id,
      email: user.email,
      username: user.username,
      phone: user.phone,
      roles: user.roles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, pwd, username, phone } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });
    
    // Create new user with default role 'customer'
    const newUser = new User({
      email,
      pwd, // Stored in plain text for simplicity and consistency with seeded users
      username,
      phone,
      roles: ['customer']
    });
    
    await newUser.save();
    
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      phone: newUser.phone,
      roles: newUser.roles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
