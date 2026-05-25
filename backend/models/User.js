const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cart: [
        {
            id: { type: Number, required: true },
            plant: { type: Object, required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
