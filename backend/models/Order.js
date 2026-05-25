const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            plantName: { type: String, required: true },
            price: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
    advancePaid: { type: Boolean, default: false },
    receiptUrl: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'delivered'],
        default: 'pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
