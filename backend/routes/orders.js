const express = require('express');
const Order = require('../models/Order');
const protect = require('../middleware/auth');

const router = express.Router();

// POST /api/orders  — create order (requires login)
router.post('/', protect, async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0)
            return res.status(400).json({ message: 'Cart is empty.' });

        // Calculate total price based on the backend array
        let totalAmount = 0;
        const orderItems = items.map(i => {
            const p = parseFloat(i.plant.price.replace(/[^0-9.]/g, ''));
            const q = i.quantity;
            totalAmount += p * q;
            return {
                plantName: i.plant.name,
                price: i.plant.price,
                quantity: q
            };
        });

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount: totalAmount,
        });

        res.status(201).json({ message: 'Order placed successfully!', order });
    } catch (err) {
        console.error('Order error:', err);
        res.status(500).json({ message: 'Server error placing order.' });
    }
});

// GET /api/orders/mine  — get current user's orders
router.get('/mine', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching orders.' });
    }
});

module.exports = router;
