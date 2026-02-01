const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Photo = require('./models/Photo');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Smart Syncing...'))
    .catch(err => console.log("Connection Error: ", err));

const syncPhotos = async () => {
    try {
        const datasetDir = path.join(__dirname, 'dataset');
        const categories = fs.readdirSync(datasetDir);

        for (const category of categories) {
            const categoryPath = path.join(datasetDir, category);
            
            if (fs.lstatSync(categoryPath).isDirectory()) {
                const files = fs.readdirSync(categoryPath);
                console.log(`Checking folder: ${category}...`);

                for (const file of files) {
                    if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
                        const filePath = `dataset/${category}/${file}`;
                        
                        // চেক করছি এই ফাইলটি অলরেডি ডাটাবেসে আছে কি না
                        const exists = await Photo.findOne({ filePath: filePath });
                        
                        if (!exists) {
                            await Photo.create({
                                filename: file,
                                filePath: filePath,
                                label: category
                            });
                        }
                    }
                }
            }
        }
        console.log('স্মার্ট সিঙ্কিং শেষ! শুধুমাত্র নতুন ছবিগুলো সেভ হয়েছে।');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

syncPhotos();