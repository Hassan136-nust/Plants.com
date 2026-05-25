const mongoose = require('mongoose');
require('dotenv').config();
const Plant = require('./models/Plant');

async function checkPrices() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const plants = await Plant.find({}).select('name price');
        
        console.log('Current prices in database:');
        console.log('================================');
        plants.forEach(plant => {
            console.log(`${plant.name}: "${plant.price}"`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkPrices();
