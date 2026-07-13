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

module.exports = router;
