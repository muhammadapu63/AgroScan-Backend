const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Cloudinary কনফিগারেশন
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary স্টোরেজ সেটআপ
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'AgroScan_Uploads',
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage: storage });

// ডাটাবেস কানেকশন
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully! ✅"))
    .catch(err => console.log(err));

// --- API: ছবি আপলোড এবং রোগ শনাক্তকরণ (Demo) ---
app.post('/api/predict', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("ছবি আপলোড হয়নি।");

        // ক্লাউড ইমেজের লিঙ্ক
        const imageUrl = req.file.path; 

        // ডেমো রেজাল্ট (Phase-II তে এখানে ML আসবে)
        const results = ["Potato___Healthy", "Potato___Late_blight"];
        const pred = results[Math.floor(Math.random() * results.length)];

        res.json({ 
            success: true,
            result: pred,
            imageUrl: imageUrl 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});