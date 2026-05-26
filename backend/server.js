require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const uploadRoutes = require('./routes/upload');
const plantsRoutes = require('./routes/plants');
const contactRoutes = require('./routes/contact');

const app = express();


// ─── CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://zia-nursery.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {

        // Allow requests with no origin
        if (!origin) return callback(null, true);

        const isAllowed =
            allowedOrigins.includes(origin) ||
            /\.vercel\.app$/i.test(origin) ||
            /localhost:\d+$/i.test(origin);

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


// ─── STATIC FILES ───────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ─── BODY PARSER ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ─── MONGODB CONNECTION ─────────────────────────────────────────────────────
let isConnected = false;

const connectDB = async () => {

    if (isConnected) {
        return;
    }

    try {

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
        });

        isConnected = conn.connections[0].readyState;

        console.log('✅ MongoDB Connected');

    } catch (error) {

        console.error('❌ MongoDB Connection Error:', error.message);
        throw error;
    }
};


// Connect DB before every request (important for Vercel serverless)
app.use(async (req, res, next) => {

    try {

        await connectDB();
        next();

    } catch (error) {

        return res.status(500).json({
            message: 'Database connection failed',
            error: error.message
        });
    }
});


// ─── ROUTES ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/plants', plantsRoutes);
app.use('/api/contact', contactRoutes);


// ─── HEALTH CHECK ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Zia Nursery API is running 🌿'
    });
});


// ─── 404 HANDLER ────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found.`
    });
});


// ─── START SERVER (LOCAL ONLY) ─────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

if (process.env.VERCEL !== '1') {

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}


// ─── EXPORT FOR VERCEL ──────────────────────────────────────────────────────
module.exports = app;