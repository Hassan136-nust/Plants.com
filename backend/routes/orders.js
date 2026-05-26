const express = require('express');
const Order = require('../models/Order');
const Plant = require('../models/Plant');
const protect = require('../middleware/auth');

const router = express.Router();

// Middleware to Check Admin Role
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// @route   POST /api/orders
// @desc    Create a new order from cart
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { items, address, city, zipCode, phone, receiptUrl, advancePaid } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // ── Fetch all referenced plant IDs from MongoDB in one query ──────────
        const plantIds = items
            .map(it => it.id || it.plant?._id || it.plant?.id)
            .filter(Boolean);

        const dbPlants = await Plant.find({ _id: { $in: plantIds } }).select('name price').lean();
        const plantMap = new Map(dbPlants.map(p => [String(p._id), p]));

        // ── Build order items using live DB prices (fallback to client price) ──
        let totalAmount = 0;

        const formattedItems = items.map(item => {
            const plantData = item.plant || {};
            const itemId = String(item.id || plantData._id || plantData.id || '');
            const dbPlant = plantMap.get(itemId);

            // Prefer live DB price to prevent manipulation / zero price bugs
            const rawPrice = dbPlant?.price ?? plantData.price ?? item.price ?? '0';

            const priceNum = parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 0;
            const qty = Math.max(1, parseInt(item.quantity) || 1);
            totalAmount += priceNum * qty;

            return {
                plantName: dbPlant?.name || plantData.name || item.plantName || 'Unknown',
                price: String(rawPrice),   // e.g. "Rs. 2500"
                priceNum,                  // e.g. 2500
                quantity: qty,
            };
        });

        totalAmount = Math.round(totalAmount);

        const order = new Order({
            user: req.user.id,
            items: formattedItems,
            totalAmount,
            address,
            city,
            zipCode,
            phone,
            receiptUrl,
            advancePaid
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || 'confirmed';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
