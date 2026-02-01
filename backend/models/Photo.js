const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    filePath: { type: String, required: true },
    label: { type: String, required: true }, // এখানে সেভ হবে 'Potato___Late_blight'
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Photo', PhotoSchema);