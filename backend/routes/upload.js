const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

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
        folder: 'zia-nursery/receipts',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
        transformation: [{ quality: 'auto' }],
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST /api/upload
router.post('/', upload.single('receipt'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }
        // Cloudinary gives us req.file.path as the secure URL
        res.status(200).json({ message: 'File uploaded successfully', url: req.file.path });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ message: 'Failed to upload receipt', error: err.message });
    }
});

module.exports = router;
