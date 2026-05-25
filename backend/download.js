const https = require('https');
const fs = require('fs');

const unsplashIds = [
    "1614594975525-e45190c55d0b", "1593482892290-f54927ae1b7e", "1597055905273-082ee5b88c7f",
    "1593691509543-c55fb32e7355", "1596547609652-9fc5d8d42dca", "1632207691143-643e2a9a9361",
    "1620641788421-7a1c342ea42e", "1611211232932-d3126dd1cd37", "1601370690183-1c7796ecec61",
    "1485955900006-d0f28e23b123", "1416879598056-0cbb04922f84", "1453904300235-0f2f60b15b5d",
    "1463936575829-25148fb5ca13", "1501004318641-b3fae3ccfb7c", "1512428559087-560fa5ceab42",
    "1509423350716-97d934bb67a9", "1459433460138-0387a2a5f78b", "1545241047-6083a3641b9e",
    "1487700160041-babef9e18ad4", "1524490805364-e12739343cf3"
];

const dir = './uploads/plants';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

Promise.all(unsplashIds.map(id => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(`${dir}/${id}.jpg`);
        https.get(`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=800`, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', err => {
            fs.unlink(`${dir}/${id}.jpg`);
            reject(err);
        });
    });
})).then(() => {
    console.log("All 20 high-res plants downloaded locally successfully.");
}).catch(console.error);
