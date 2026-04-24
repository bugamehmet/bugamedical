// seedGallery.js
require('dotenv').config();
const mongoose = require('mongoose');
const GalleryImage = require('./models/GalleryImage');

async function run() {
	await mongoose.connect(process.env.MONGODB_URI);

	// Eski galeriyi temizlemek istersen:
	//await GalleryImage.deleteMany({});

	const rfImages = Array.from({ length: 44 }, (_, i) => {
		const index = i + 1;

		// 1–40 .jpeg, 41–44 .jpg (HTML'ine göre)
		const ext = index <= 40 ? 'jpeg' : 'jpg';

		return {
			imagePath: `/assets/images/galeri/rf${index}.${ext}`,
			altText: ` Siemens, Philips, GE | MRI, CT, X-Ray Parts and Services.`,
			caption: 'Siemens, Philips, GE | MRI, CT, X-Ray Parts and Services.',
			category: 'Siemens, Philips, GE | MRI, CT, X-Ray Parts and Services.',
			order: index,
		};
	});

	await GalleryImage.insertMany(rfImages);

	console.log('Gallery images eklendi');
	await mongoose.disconnect();
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
