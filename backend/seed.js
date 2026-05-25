const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Plant = require('./models/Plant');

const PLANTS_DATA = [
    // Indoor
    { name: "Monstera Deliciosa", scientificName: "Monstera deliciosa", price: "Rs. 2500", category: "Indoor", imageUrl: "http://localhost:5001/uploads/plants/monstera-deliciosa.jpg", isCarousel: true },
    { name: "Alocasia Polly", scientificName: "Alocasia amazonica", price: "Rs. 1800", category: "Indoor", imageUrl: "http://localhost:5001/uploads/plants/alocasia-polly.jpg", isCarousel: false },
    { name: "Bird of Paradise", scientificName: "Strelitzia reginae", price: "Rs. 4500", category: "Indoor", imageUrl: "http://localhost:5001/uploads/plants/bird-of-paradise.jpg", isCarousel: true },
    { name: "Pink Princess", scientificName: "Philodendron erubescens", price: "Rs. 6000", category: "Indoor", imageUrl: "http://localhost:5001/uploads/plants/pink-princess.jpg", isCarousel: true },
    { name: "Chinese Evergreen", scientificName: "Aglaonema", price: "Rs. 1200", category: "Indoor", imageUrl: "http://localhost:5001/uploads/plants/chinese-evergreen.jpg", isCarousel: false },

    // Low Light
    { name: "Snake Plant", scientificName: "Sansevieria trifasciata", price: "Rs. 950", category: "Low Light", imageUrl: "http://localhost:5001/uploads/plants/snake-plant.jpg", isCarousel: false },
    { name: "ZZ Plant", scientificName: "Zamioculcas zamiifolia", price: "Rs. 1400", category: "Low Light", imageUrl: "http://localhost:5001/uploads/plants/zz-plant.jpg", isCarousel: true },
    { name: "Cast Iron Plant", scientificName: "Aspidistra elatior", price: "Rs. 1100", category: "Low Light", imageUrl: "http://localhost:5001/uploads/plants/cast-iron.jpg", isCarousel: false },
    { name: "Parlor Palm", scientificName: "Chamaedorea elegans", price: "Rs. 1650", category: "Low Light", imageUrl: "http://localhost:5001/uploads/plants/parlor-palm.jpg", isCarousel: false },
    { name: "Chinese Money Plant", scientificName: "Pilea", price: "Rs. 850", category: "Low Light", imageUrl: "http://localhost:5001/uploads/plants/pilea.jpg", isCarousel: false },

    // Flowering
    { name: "Peace Lily", scientificName: "Spathiphyllum", price: "Rs. 1300", category: "Flowering", imageUrl: "http://localhost:5001/uploads/plants/peace-lily.jpg", isCarousel: true },
    { name: "Anthurium", scientificName: "Anthurium andraeanum", price: "Rs. 1750", category: "Flowering", imageUrl: "http://localhost:5001/uploads/plants/anthurium.jpg", isCarousel: true },
    { name: "Orchid", scientificName: "Phalaenopsis", price: "Rs. 3200", category: "Flowering", imageUrl: "http://localhost:5001/uploads/plants/orchid.jpg", isCarousel: true },
    { name: "African Violet", scientificName: "Saintpaulia", price: "Rs. 700", category: "Flowering", imageUrl: "http://localhost:5001/uploads/plants/african-violet.jpg", isCarousel: false },
    { name: "Bromeliad", scientificName: "Bromeliaceae", price: "Rs. 2100", category: "Flowering", imageUrl: "http://localhost:5001/uploads/plants/bromeliad.jpg", isCarousel: false },

    // Succulent
    { name: "Aloe Vera", scientificName: "Aloe barbadensis miller", price: "Rs. 600", category: "Succulent", imageUrl: "http://localhost:5001/uploads/plants/aloe-vera.jpg", isCarousel: false },
    { name: "Jade Plant", scientificName: "Crassula ovata", price: "Rs. 800", category: "Succulent", imageUrl: "http://localhost:5001/uploads/plants/jade-plant.jpg", isCarousel: false },
    { name: "Echeveria Elegans", scientificName: "Echeveria", price: "Rs. 450", category: "Succulent", imageUrl: "http://localhost:5001/uploads/plants/echeveria.jpg", isCarousel: false },
    { name: "Zebra Plant", scientificName: "Haworthiopsis fasciata", price: "Rs. 550", category: "Succulent", imageUrl: "http://localhost:5001/uploads/plants/zebra-plant.jpg", isCarousel: false },
    { name: "String of Pearls", scientificName: "Senecio rowleyanus", price: "Rs. 1250", category: "Succulent", imageUrl: "http://localhost:5001/uploads/plants/string-of-pearls.jpg", isCarousel: true },

    // Tree
    { name: "Fiddle Leaf Fig", scientificName: "Ficus lyrata", price: "Rs. 3800", category: "Tree", imageUrl: "http://localhost:5001/uploads/plants/fiddle-leaf.jpg", isCarousel: true },
    { name: "Rubber Tree", scientificName: "Ficus elastica", price: "Rs. 2200", category: "Tree", imageUrl: "http://localhost:5001/uploads/plants/rubber-tree.jpg", isCarousel: false },
    { name: "Money Tree", scientificName: "Pachira aquatica", price: "Rs. 2900", category: "Tree", imageUrl: "http://localhost:5001/uploads/plants/money-tree.jpg", isCarousel: true },
    { name: "Dragon Tree", scientificName: "Dracaena marginata", price: "Rs. 1700", category: "Tree", imageUrl: "http://localhost:5001/uploads/plants/dragon-tree.jpg", isCarousel: false },
    { name: "Weeping Fig", scientificName: "Ficus benjamina", price: "Rs. 2600", category: "Tree", imageUrl: "http://localhost:5001/uploads/plants/weeping-fig.jpg", isCarousel: false },

    // Hanging
    { name: "Spider Plant", scientificName: "Chlorophytum comosum", price: "Rs. 750", category: "Hanging", imageUrl: "http://localhost:5001/uploads/plants/spider-plant.jpg", isCarousel: false },
    { name: "Boston Fern", scientificName: "Nephrolepis exaltata", price: "Rs. 1150", category: "Hanging", imageUrl: "http://localhost:5001/uploads/plants/boston-fern.jpg", isCarousel: false },
    { name: "English Ivy", scientificName: "Hedera helix", price: "Rs. 850", category: "Hanging", imageUrl: "http://localhost:5001/uploads/plants/english-ivy.jpg", isCarousel: false },
    { name: "Wandering Jew", scientificName: "Tradescantia zebrina", price: "Rs. 900", category: "Hanging", imageUrl: "http://localhost:5001/uploads/plants/wandering-jew.jpg", isCarousel: true },
    { name: "String of Hearts", scientificName: "Ceropegia woodii", price: "Rs. 1600", category: "Hanging", imageUrl: "http://localhost:5001/uploads/plants/string-hearts.jpg", isCarousel: false },

    // Vine
    { name: "Golden Pothos", scientificName: "Epipremnum aureum", price: "Rs. 650", category: "Vine", imageUrl: "http://localhost:5001/uploads/plants/golden-pothos.jpg", isCarousel: false },
    { name: "Neon Pothos", scientificName: "Epipremnum aureum 'Neon'", price: "Rs. 750", category: "Vine", imageUrl: "http://localhost:5001/uploads/plants/neon-pothos.jpg", isCarousel: false },
    { name: "Heartleaf Philodendron", scientificName: "Philodendron hederaceum", price: "Rs. 850", category: "Vine", imageUrl: "http://localhost:5001/uploads/plants/philodendron.jpg", isCarousel: false },
    { name: "Monstera Adansonii", scientificName: "Monstera adansonii", price: "Rs. 1450", category: "Vine", imageUrl: "http://localhost:5001/uploads/plants/adansonii.jpg", isCarousel: true },
    { name: "Satin Pothos", scientificName: "Scindapsus pictus", price: "Rs. 1200", category: "Vine", imageUrl: "http://localhost:5001/uploads/plants/satin-pothos.jpg", isCarousel: false },

    // Outdoor
    { name: "Lavender", scientificName: "Lavandula", price: "Rs. 800", category: "Outdoor", imageUrl: "http://localhost:5001/uploads/plants/lavender.jpg", isCarousel: false },
    { name: "Rose Bush", scientificName: "Rosa", price: "Rs. 1500", category: "Outdoor", imageUrl: "http://localhost:5001/uploads/plants/rose-bush.jpg", isCarousel: true },
    { name: "Hydrangea", scientificName: "Hydrangea macrophylla", price: "Rs. 2300", category: "Outdoor", imageUrl: "http://localhost:5001/uploads/plants/hydrangea.jpg", isCarousel: false },
    { name: "Boxwood", scientificName: "Buxus", price: "Rs. 1200", category: "Outdoor", imageUrl: "http://localhost:5001/uploads/plants/boxwood.jpg", isCarousel: false },
    { name: "Bougainvillea", scientificName: "Bougainvillea glabra", price: "Rs. 2800", category: "Outdoor", imageUrl: "http://localhost:5001/uploads/plants/bougainvillea.jpg", isCarousel: true }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Plant.deleteMany();
        console.log('Old plants destroyed...');

        await Plant.insertMany(PLANTS_DATA);
        console.log('40 glorious precise plants loaded into MongoDB! 🌿');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
