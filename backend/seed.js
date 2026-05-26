const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Plant = require('./models/Plant');

const PLANTS_DATA = [
    // Indoor
    { name: "Monstera Deliciosa", scientificName: "Monstera deliciosa", price: 2500, category: "Indoor", imageUrl: "http://localhost:5001/uploads/plants/monstera-deliciosa.jpg", isCarousel: true },
    { name: "Alocasia Polly", scientificName: "Alocasia amazonica", price: 1800, category: "Indoor", imageUrl: "http://localhost:5001/uploads/plants/alocasia-polly.jpg", isCarousel: false },
    { name: "Bird of Paradise", scientificName: "Strelitzia reginae", price: 4500, category: "Indoor", imageUrl: "http://localhost:5001/uploads/plants/bird-of-paradise.jpg", isCarousel: true },
    { name: "Pink Princess", scientificName: "Philodendron erubescens", price: 6000, category: "Indoor", imageUrl: "http://localhost:5001/uploads/plants/pink-princess.jpg", isCarousel: true },
    { name: "Chinese Evergreen", scientificName: "Aglaonema", price: 1200, category: "Indoor", imageUrl: "http://localhost:5001/uploads/plants/chinese-evergreen.jpg", isCarousel: false },

    // Low Light
    { name: "Snake Plant", scientificName: "Sansevieria trifasciata", price: 950, category: "Low Light", imageUrl: "http://localhost:5001/uploads/plants/snake-plant.jpg", isCarousel: false },
    { name: "ZZ Plant", scientificName: "Zamioculcas zamiifolia", price: 1400, category: "Low Light", imageUrl: "http://localhost:5001/uploads/plants/zz-plant.jpg", isCarousel: true },
    { name: "Cast Iron Plant", scientificName: "Aspidistra elatior", price: 1100, category: "Low Light", imageUrl: "http://localhost:5001/uploads/plants/cast-iron.jpg", isCarousel: false },
    { name: "Parlor Palm", scientificName: "Chamaedorea elegans", price: 1650, category: "Low Light", imageUrl: "http://localhost:5001/uploads/plants/parlor-palm.jpg", isCarousel: false },
    { name: "Chinese Money Plant", scientificName: "Pilea", price: 850, category: "Low Light", imageUrl: "http://localhost:5001/uploads/plants/pilea.jpg", isCarousel: false },

    // Flowering
    { name: "Peace Lily", scientificName: "Spathiphyllum", price: 1300, category: "Flowering", imageUrl: "http://localhost:5001/uploads/plants/peace-lily.jpg", isCarousel: true },
    { name: "Anthurium", scientificName: "Anthurium andraeanum", price: 1750, category: "Flowering", imageUrl: "http://localhost:5001/uploads/plants/anthurium.jpg", isCarousel: true },
    { name: "Orchid", scientificName: "Phalaenopsis", price: 3200, category: "Flowering", imageUrl: "http://localhost:5001/uploads/plants/orchid.jpg", isCarousel: true },
    { name: "African Violet", scientificName: "Saintpaulia", price: 700, category: "Flowering", imageUrl: "http://localhost:5001/uploads/plants/african-violet.jpg", isCarousel: false },
    { name: "Bromeliad", scientificName: "Bromeliaceae", price: 2100, category: "Flowering", imageUrl: "http://localhost:5001/uploads/plants/bromeliad.jpg", isCarousel: false },

    // Succulent
    { name: "Aloe Vera", scientificName: "Aloe barbadensis miller", price: 600, category: "Succulent", imageUrl: "http://localhost:5001/uploads/plants/aloe-vera.jpg", isCarousel: false },
    { name: "Jade Plant", scientificName: "Crassula ovata", price: 800, category: "Succulent", imageUrl: "http://localhost:5001/uploads/plants/jade-plant.jpg", isCarousel: false },
    { name: "Echeveria Elegans", scientificName: "Echeveria", price: 450, category: "Succulent", imageUrl: "http://localhost:5001/uploads/plants/echeveria.jpg", isCarousel: false },
    { name: "Zebra Plant", scientificName: "Haworthiopsis fasciata", price: 550, category: "Succulent", imageUrl: "http://localhost:5001/uploads/plants/zebra-plant.jpg", isCarousel: false },
    { name: "String of Pearls", scientificName: "Senecio rowleyanus", price: 1250, category: "Succulent", imageUrl: "http://localhost:5001/uploads/plants/string-of-pearls.jpg", isCarousel: true },

    // Tree
    { name: "Fiddle Leaf Fig", scientificName: "Ficus lyrata", price: 3800, category: "Tree", imageUrl: "http://localhost:5001/uploads/plants/fiddle-leaf.jpg", isCarousel: true },
    { name: "Rubber Tree", scientificName: "Ficus elastica", price: 2200, category: "Tree", imageUrl: "http://localhost:5001/uploads/plants/rubber-tree.jpg", isCarousel: false },
    { name: "Money Tree", scientificName: "Pachira aquatica", price: 2900, category: "Tree", imageUrl: "http://localhost:5001/uploads/plants/money-tree.jpg", isCarousel: true },
    { name: "Dragon Tree", scientificName: "Dracaena marginata", price: 1700, category: "Tree", imageUrl: "http://localhost:5001/uploads/plants/dragon-tree.jpg", isCarousel: false },
    { name: "Weeping Fig", scientificName: "Ficus benjamina", price: 2600, category: "Tree", imageUrl: "http://localhost:5001/uploads/plants/weeping-fig.jpg", isCarousel: false },

    // Hanging
    { name: "Spider Plant", scientificName: "Chlorophytum comosum", price: 750, category: "Hanging", imageUrl: "http://localhost:5001/uploads/plants/spider-plant.jpg", isCarousel: false },
    { name: "Boston Fern", scientificName: "Nephrolepis exaltata", price: 1150, category: "Hanging", imageUrl: "http://localhost:5001/uploads/plants/boston-fern.jpg", isCarousel: false },
    { name: "English Ivy", scientificName: "Hedera helix", price: 850, category: "Hanging", imageUrl: "http://localhost:5001/uploads/plants/english-ivy.jpg", isCarousel: false },
    { name: "Wandering Jew", scientificName: "Tradescantia zebrina", price: 900, category: "Hanging", imageUrl: "http://localhost:5001/uploads/plants/wandering-jew.jpg", isCarousel: true },
    { name: "String of Hearts", scientificName: "Ceropegia woodii", price: 1600, category: "Hanging", imageUrl: "http://localhost:5001/uploads/plants/string-hearts.jpg", isCarousel: false },

    // Vine
    { name: "Golden Pothos", scientificName: "Epipremnum aureum", price: 650, category: "Vine", imageUrl: "http://localhost:5001/uploads/plants/golden-pothos.jpg", isCarousel: false },
    { name: "Neon Pothos", scientificName: "Epipremnum aureum 'Neon'", price: 750, category: "Vine", imageUrl: "http://localhost:5001/uploads/plants/neon-pothos.jpg", isCarousel: false },
    { name: "Heartleaf Philodendron", scientificName: "Philodendron hederaceum", price: 850, category: "Vine", imageUrl: "http://localhost:5001/uploads/plants/philodendron.jpg", isCarousel: false },
    { name: "Monstera Adansonii", scientificName: "Monstera adansonii", price: 1450, category: "Vine", imageUrl: "http://localhost:5001/uploads/plants/adansonii.jpg", isCarousel: true },
    { name: "Satin Pothos", scientificName: "Scindapsus pictus", price: 1200, category: "Vine", imageUrl: "http://localhost:5001/uploads/plants/satin-pothos.jpg", isCarousel: false },

    // Outdoor
    { name: "Lavender", scientificName: "Lavandula", price: 800, category: "Outdoor", imageUrl: "http://localhost:5001/uploads/plants/lavender.jpg", isCarousel: false },
    { name: "Rose Bush", scientificName: "Rosa", price: 1500, category: "Outdoor", imageUrl: "http://localhost:5001/uploads/plants/rose-bush.jpg", isCarousel: true },
    { name: "Hydrangea", scientificName: "Hydrangea macrophylla", price: 2300, category: "Outdoor", imageUrl: "http://localhost:5001/uploads/plants/hydrangea.jpg", isCarousel: false },
    { name: "Boxwood", scientificName: "Buxus", price: 1200, category: "Outdoor", imageUrl: "http://localhost:5001/uploads/plants/boxwood.jpg", isCarousel: false },
    { name: "Bougainvillea", scientificName: "Bougainvillea glabra", price: 2800, category: "Outdoor", imageUrl: "http://localhost:5001/uploads/plants/bougainvillea.jpg", isCarousel: true }
];

/**
 * seedDB()
 * (kept as an explicit action) — use `node seed.js --seed` to wipe and re-insert
 */
const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Plant.deleteMany();
        console.log('Old plants destroyed...');

        await Plant.insertMany(PLANTS_DATA.map(p => ({
            ...p,
            price: (typeof p.price === 'number') ? p.price : parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0
        })));
        console.log(`${PLANTS_DATA.length} plants loaded into MongoDB.`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};


/**
 * migratePrices()
 * Converts any existing `price` fields on `plants` to numeric values in-place.
 * Run with: `node seed.js --migrate-prices`
 */
const migratePrices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const plants = await Plant.find({});
        let updated = 0;
        for (const p of plants) {
            const raw = p.price;
            const num = (typeof raw === 'number') ? raw : parseFloat(String(raw).replace(/[^0-9.]/g, '')) || 0;
            if (num !== p.price) {
                await Plant.updateOne({ _id: p._id }, { $set: { price: num } });
                updated++;
            }
        }
        console.log(`Price migration complete — ${updated} document(s) updated.`);
        process.exit();
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
};


// CLI args
const argv = process.argv.slice(2);

// If no flags provided, run the safe migration by default
if (argv.length === 0) {
    migratePrices();
}

/**
 * --price-fix
 * Apply a small set of manual price corrections for documents that ended
 * up with `price: 0` or string prices. This uses a safe upsert-style
 * update only if the value differs.
 *
 * Run with: `node seed.js --price-fix`
 */
if (argv.includes('--price-fix')) {
    (async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            const PRICE_FIXES = {
                '6a14358d6717c2b958c9cd1e': 750,    // Spider Plant
                '6a14358d6717c2b958c9cd1f': 1150,   // Boston Fern
                '6a14358d6717c2b958c9cd20': 850,    // English Ivy
                '6a14358d6717c2b958c9cd21': 900,    // Wandering Jew
                '6a14358d6717c2b958c9cd2a': 2300,   // Hydrangea
                '6a14358d6717c2b958c9cd2b': 1200,   // Boxwood
                '6a14358d6717c2b958c9cd2c': 2800,   // Bougainvillea
                '6a1524f9d5a29bc9829b7b6f': 20000   // Testing (string -> number)
            };

            let changed = 0;
            for (const [id, price] of Object.entries(PRICE_FIXES)) {
                const doc = await Plant.findById(id).lean();
                if (!doc) {
                    console.warn('Price-fix: doc not found', id);
                    continue;
                }
                const curr = (typeof doc.price === 'number') ? doc.price : parseFloat(String(doc.price).replace(/[^0-9.]/g, '')) || 0;
                if (curr !== price) {
                    await Plant.updateOne({ _id: id }, { $set: { price: price } });
                    console.log(`Updated ${id} (${doc.name}): ${curr} → ${price}`);
                    changed++;
                } else {
                    console.log(`Skipped ${id} (${doc.name}): already ${price}`);
                }
            }
            console.log(`Price-fix completed. ${changed} document(s) updated.`);
            process.exit(0);
        } catch (err) {
            console.error('Price-fix error:', err);
            process.exit(1);
        }
    })();
}

/**
 * --apply-prices
 * Update every plant in the database using the canonical `PLANTS_DATA` list.
 * Matches by exact `name` and writes numeric `price` values.
 * Run with: `node seed.js --apply-prices`
 */
if (argv.includes('--apply-prices')) {
    (async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            let changed = 0;
            for (const p of PLANTS_DATA) {
                const desired = (typeof p.price === 'number') ? p.price : parseFloat(String(p.price).replace(/[^0-9.]/g,'')) || 0;
                const doc = await Plant.findOne({ name: p.name }).lean();
                if (!doc) {
                    console.warn('apply-prices: not found in DB ->', p.name);
                    continue;
                }
                const curr = (typeof doc.price === 'number') ? doc.price : parseFloat(String(doc.price).replace(/[^0-9.]/g,'')) || 0;
                if (curr !== desired) {
                    await Plant.updateOne({ _id: doc._id }, { $set: { price: desired } });
                    console.log(`Updated ${p.name}: ${curr} → ${desired}`);
                    changed++;
                } else {
                    console.log(`Skipped ${p.name}: already ${desired}`);
                }
            }
            console.log(`apply-prices complete — ${changed} document(s) updated.`);
            process.exit(0);
        } catch (err) {
            console.error('apply-prices error:', err);
            process.exit(1);
        }
    })();
}
