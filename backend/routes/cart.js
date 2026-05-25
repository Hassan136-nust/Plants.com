const express = require('express');
const User = require('../models/User');
const protect = require('../middleware/auth');

const router = express.Router();

// GET /api/cart  - fetch logged-in user's cart
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ cart: user.cart || [] });
    } catch (err) {
        console.error('Cart fetch error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/cart - update the cart array completely
router.put('/', protect, async (req, res) => {
    try {
        const { cart } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.cart = cart || [];
        await user.save();

        res.status(200).json({ cart: user.cart, message: 'Cart synced' });
    } catch (err) {
        console.error('Cart sync error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
