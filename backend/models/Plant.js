const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Plant name is required'],
        trim: true,
    },
    scientificName: {
        type: String,
        required: [true, 'Scientific name is required'],
        trim: true,
    },
    price: {
        type: String,
        required: [true, 'Price is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    imageUrl: {
        type: String,
        required: true,
    },
    isCarousel: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema);
