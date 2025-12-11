// models/GalleryImage.js
const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
	imagePath: { type: String, required: true }, // /assets/images/galeri/rf1.jpeg
	altText: { type: String }, // "Image 1 Açıklaması"
	caption: { type: String }, // "RF"
	category: { type: String }, // "RF", "CT", "Room", vs
	order: { type: Number }, // sıralama
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
