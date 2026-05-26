const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Plant = require('../models/Plant');
const protect = require('../middleware/auth');

const router = express.Router();

// ─── Cloudinary Config ────────────────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Multer → Cloudinary Storage ─────────────────────────────────────────────
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'zia-nursery/plants',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

// ─── Admin check ──────────────────────────────────────────────────────────────
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next();
    res.status(401).json({ message: 'Not authorized as an admin' });
};

// @route   GET /api/plants
// @desc    Get all plants
// @access  Public
router.get('/', async (req, res) => {
    try {
        const plants = await Plant.find({});
        res.json(plants);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   POST /api/plants
// @desc    Create a new plant
// @access  Private/Admin
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
    try {
        const { name, scientificName, price, category, isCarousel } = req.body;

        // Cloudinary upload gives us req.file.path (the secure URL)
        let imageUrl = req.body.imageUrl;
        if (req.file) {
            imageUrl = req.file.path; // Cloudinary secure URL
        }

        if (!imageUrl) {
            return res.status(400).json({ message: 'Image is required' });
        }

        // Normalize price to a Number (accept human-friendly strings like "Rs. 2,500")
        const priceNum = parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;

        const plant = new Plant({
            name,
            scientificName,
            price: priceNum,
            category,
            imageUrl,
            isCarousel: isCarousel === 'true' || isCarousel === true,
        });

        const created = await plant.save();
        res.status(201).json(created);
    } catch (err) {
        console.error('POST /api/plants error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   PUT /api/plants/:id
// @desc    Update a plant
// @access  Private/Admin
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) return res.status(404).json({ message: 'Plant not found' });

        if (req.file) plant.imageUrl = req.file.path; // Cloudinary URL
        if (req.body.name) plant.name = req.body.name;
        if (req.body.scientificName) plant.scientificName = req.body.scientificName;
        if (req.body.price) plant.price = parseFloat(String(req.body.price).replace(/[^0-9.]/g, '')) || plant.price;
        if (req.body.category) plant.category = req.body.category;
        if (req.body.isCarousel !== undefined)
            plant.isCarousel = req.body.isCarousel === 'true' || req.body.isCarousel === true;

        const updated = await plant.save();
        res.json(updated);
    } catch (err) {
        console.error('PUT /api/plants/:id error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   DELETE /api/plants/:id
// @desc    Delete a plant
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) return res.status(404).json({ message: 'Plant not found' });
        await plant.deleteOne();
        res.json({ message: 'Plant removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;
