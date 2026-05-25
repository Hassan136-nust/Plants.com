const mongoose = require('mongoose');
require('dotenv').config();
const Plant = require('./models/Plant');

// Price updates - only for plants that have incorrect prices
const PRICE_UPDATES = {
    "Alocasia Polly": "Rs. 1800",
    "Monstera Deliciosa": "Rs. 2500",
    "Bird of Paradise": "Rs. 4500",
    "Pink Princess": "Rs. 6000",
    "Chinese Evergreen": "Rs. 1200",
    "Snake Plant": "Rs. 950",
    "ZZ Plant": "Rs. 1400",
    "Cast Iron Plant": "Rs. 1100",
    "Parlor Palm": "Rs. 1650",
    "Chinese Money Plant": "Rs. 850",
    "Peace Lily": "Rs. 1300",
    "Anthurium": "Rs. 1750",
    "Orchid": "Rs. 3200",
    "African Violet": "Rs. 700",
    "Bromeliad": "Rs. 2100",
    "Aloe Vera": "Rs. 600",
    "Jade Plant": "Rs. 800",
    "Echeveria Elegans": "Rs. 450",
    "Zebra Plant": "Rs. 550",
    "String of Pearls": "Rs. 1250",
    "Fiddle Leaf Fig": "Rs. 3800",
    "Rubber Tree": "Rs. 2200",
    "Money Tree": "Rs. 2900",
    "Dragon Tree": "Rs. 1700",
    "Weeping Fig": "Rs. 2600",
    "Spider Plant": "Rs. 750",
    "Boston Fern": "Rs. 1150",
    "English Ivy": "Rs. 850",
    "Wandering Jew": "Rs. 900",
    "String of Hearts": "Rs. 1600",
    "Golden Pothos": "Rs. 650",
    "Neon Pothos": "Rs. 750",
    "Heartleaf Philodendron": "Rs. 850",
    "Monstera Adansonii": "Rs. 1450",
    "Satin Pothos": "Rs. 1200",
    "Lavender": "Rs. 800",
    "Rose Bush": "Rs. 1500",
    "Hydrangea": "Rs. 2300",
    "Boxwood": "Rs. 1200",
    "Bougainvillea": "Rs. 2800"
};

async function updatePrices() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        let updatedCount = 0;
        
        for (const [plantName, correctPrice] of Object.entries(PRICE_UPDATES)) {
            const result = await Plant.updateOne(
                { name: plantName },
                { $set: { price: correctPrice } }
            );
            
            if (result.modifiedCount > 0) {
                console.log(`✅ Updated ${plantName}: ${correctPrice}`);
                updatedCount++;
            }
        }

        console.log(`\n🎉 Successfully updated ${updatedCount} plant prices!`);
        console.log('💡 Please refresh your browser and clear your cart to see updated prices.');
        
    } catch (error) {
        console.error('❌ Error updating prices:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
}

updatePrices();
