const https = require('https');
const fs = require('fs');
const path = require('path');

const plants = [
    { slug: "monstera-deliciosa", prompt: "Monstera Deliciosa plant" },
    { slug: "alocasia-polly", prompt: "Alocasia Amazonica Polly plant" },
    { slug: "bird-of-paradise", prompt: "Bird of Paradise plant" },
    { slug: "pink-princess", prompt: "Pink Princess Philodendron" },
    { slug: "chinese-evergreen", prompt: "Chinese Evergreen Aglaonema" },
    { slug: "snake-plant", prompt: "Snake Plant Sansevieria" },
    { slug: "zz-plant", prompt: "ZZ Plant Zamioculcas" },
    { slug: "cast-iron", prompt: "Cast Iron Plant" },
    { slug: "parlor-palm", prompt: "Parlor Palm" },
    { slug: "pilea", prompt: "Chinese Money Plant Pilea" },
    { slug: "peace-lily", prompt: "Peace Lily flowering" },
    { slug: "anthurium", prompt: "Red Anthurium flowering" },
    { slug: "orchid", prompt: "Purple Phalaenopsis Orchid" },
    { slug: "african-violet", prompt: "African Violet flower plant" },
    { slug: "bromeliad", prompt: "Pink Bromeliad plant" },
    { slug: "aloe-vera", prompt: "Aloe Vera plant" },
    { slug: "jade-plant", prompt: "Jade Plant Crassula" },
    { slug: "echeveria", prompt: "Blue Echeveria Succulent" },
    { slug: "zebra-plant", prompt: "Zebra Haworthia Succulent" },
    { slug: "string-of-pearls", prompt: "String of Pearls Succulent hanging" },
    { slug: "fiddle-leaf", prompt: "Tall Fiddle Leaf Fig Tree indoor" },
    { slug: "rubber-tree", prompt: "Burgundy Rubber Tree" },
    { slug: "money-tree", prompt: "Braided Money Tree" },
    { slug: "dragon-tree", prompt: "Madagascar Dragon Tree" },
    { slug: "weeping-fig", prompt: "Weeping Fig Tree" },
    { slug: "spider-plant", prompt: "Spider Plant hanging basket" },
    { slug: "boston-fern", prompt: "Lush Boston Fern hanging" },
    { slug: "english-ivy", prompt: "English Ivy hanging basket" },
    { slug: "wandering-jew", prompt: "Tradescantia zebrina purple hanging" },
    { slug: "string-hearts", prompt: "String of Hearts trailing plant" },
    { slug: "golden-pothos", prompt: "Golden Pothos vine on pole" },
    { slug: "neon-pothos", prompt: "Neon Pothos bright green vine" },
    { slug: "philodendron", prompt: "Heartleaf Philodendron trailing" },
    { slug: "adansonii", prompt: "Monstera Adansonii Swiss Cheese Vine" },
    { slug: "satin-pothos", prompt: "Silver Satin Pothos vine" },
    { slug: "lavender", prompt: "Lavender plant blooming outdoor" },
    { slug: "rose-bush", prompt: "Red Rose Bush outdoor garden" },
    { slug: "hydrangea", prompt: "Blue Hydrangea bush outdoor" },
    { slug: "boxwood", prompt: "Round Boxwood Shrub garden" },
    { slug: "bougainvillea", prompt: "Vibrant Pink Bougainvillea outdoor" }
];

const dir = path.join(__dirname, 'uploads', 'plants');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function download(slug, prompt) {
    return new Promise((resolve, reject) => {
        const dest = path.join(dir, `${slug}.jpg`);
        if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
            return resolve(); // Skip if already downloaded beautifully
        }
        const file = fs.createWriteStream(dest);
        const url = `https://image.pollinations.ai/prompt/Studio_HD_photo_of_${encodeURIComponent(prompt)}_in_premium_nursery_pot_white_background?width=800&height=800&nologo=true`;
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
            } else if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
                https.get(res.headers.location, (r) => {
                    r.pipe(file);
                    file.on('finish', () => { file.close(); resolve(); });
                }).on('error', reject);
            } else {
                reject(new Error(`Failed with status ${res.statusCode}`));
            }
        }).on('error', err => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

(async () => {
    const corePlants = [
        { slug: "cat-indoor", prompt: "Lush Indoor Monstera Deliciosa" },
        { slug: "cat-lowlight", prompt: "Dark green ZZ Plant in minimal pot" },
        { slug: "cat-flowering", prompt: "Vibrant Peace Lily flower plant" },
        { slug: "cat-succulent", prompt: "Beautiful Jade pattern succulent" },
        { slug: "cat-tree", prompt: "Tall Fiddle Leaf Fig tree houseplant" },
        { slug: "cat-hanging", prompt: "Lush Boston Fern hanging basket" },
        { slug: "cat-vine", prompt: "Trailing Golden Pothos vine plant" },
        { slug: "cat-outdoor", prompt: "Blooming Lavender garden plant" }
    ];

    console.log("Downloading 8 lightning-fast HD category templates...");
    try {
        await Promise.all(corePlants.map(p => download(p.slug, p.prompt)));
    } catch (e) {
        console.error("Download fail:", e);
    }
    console.log("All 8 core templates downloaded beautifully!");
})();
