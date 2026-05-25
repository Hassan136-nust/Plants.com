require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Plant = require('./models/Plant');

const PLANTS_DATA = [
    { name: "Monstera Deliciosa", scientificName: "Monstera deliciosa", price: "$45.00", category: "Indoor", imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800", isCarousel: true },
    { name: "Snake Plant", scientificName: "Sansevieria trifasciata", price: "$30.00", category: "Low Light", imageUrl: "https://images.unsplash.com/photo-1593482892290-f54927ae1b7e?auto=format&fit=crop&q=80&w=800", isCarousel: true },
    { name: "Fiddle Leaf Fig", scientificName: "Ficus lyrata", price: "$65.00", category: "Indoor", imageUrl: "https://images.unsplash.com/photo-1597055905273-082ee5b88c7f?auto=format&fit=crop&q=80&w=800", isCarousel: true },
    { name: "Peace Lily", scientificName: "Spathiphyllum", price: "$35.00", category: "Flowering", imageUrl: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&q=80&w=800", isCarousel: true },
    { name: "Aloe Vera", scientificName: "Aloe barbadensis miller", price: "$25.00", category: "Succulent", imageUrl: "https://images.unsplash.com/photo-1596547609652-9fc5d8d42dca?auto=format&fit=crop&q=80&w=800", isCarousel: true },
    { name: "ZZ Plant", scientificName: "Zamioculcas zamiifolia", price: "$40.00", category: "Low Light", imageUrl: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&q=80&w=800", isCarousel: true },
    { name: "Rubber Plant", scientificName: "Ficus elastica", price: "$55.00", category: "Tree", imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800", isCarousel: false },
    { name: "Spider Plant", scientificName: "Chlorophytum comosum", price: "$20.00", category: "Hanging", imageUrl: "https://images.unsplash.com/photo-1611211232932-d3126dd1cd37?auto=format&fit=crop&q=80&w=800", isCarousel: false },
    { name: "Pothos", scientificName: "Epipremnum aureum", price: "$22.00", category: "Vine", imageUrl: "https://images.unsplash.com/photo-1601370690183-1c7796ecec61?auto=format&fit=crop&q=80&w=800", isCarousel: false }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // Clear existing data
        await Plant.deleteMany();

        // Ensure Admin Exists
        let admin = await User.findOne({ email: 'zia@gmail.com' });
        if (!admin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('qamar123', salt);
            admin = await User.create({
                name: 'Zia Admin',
                email: 'zia@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user zia@gmail.com created successfully.');
        } else {
            // Force role to admin if it exists
            admin.role = 'admin';
            await admin.save();
            console.log('Admin user already exists, role verified.');
        }

        // Insert Plants
        await Plant.insertMany(PLANTS_DATA);
        console.log('Successfully Migrated Hardcoded Plants to MongoDB!');

        process.exit();
    } catch (error) {
        console.error('Seeding Error: ', error);
        process.exit(1);
    }
};

seedDB();
