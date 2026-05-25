const express = require('express');
const multer = require('multer');
const path = require('path');
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

// Multer Storage for Plants
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/plants/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

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
// @desc    Create a new Plant
// @access  Private/Admin
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
    try {
        const { name, scientificName, price, category, isCarousel } = req.body;

        let imageUrl = req.body.imageUrl; // if they provide a URL directly
        if (req.file) {
            imageUrl = `/uploads/plants/${req.file.filename}`;
        }

        if (!imageUrl) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const plant = new Plant({
            name,
            scientificName,
            price,
            category,
            imageUrl,
            isCarousel: isCarousel === 'true' || isCarousel === true
        });

        const createdPlant = await plant.save();
        res.status(201).json(createdPlant);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   DELETE /api/plants/:id
// @desc    Delete a plant
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (plant) {
            await plant.deleteOne();
            res.json({ message: 'Plant removed' });
        } else {
            res.status(404).json({ message: 'Plant not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;
