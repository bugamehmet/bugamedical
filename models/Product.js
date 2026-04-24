// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		sku: { type: String, required: true, unique: true, index: true, trim: true },
		mpn: { type: String, index: true, trim: true },
		oem: { type: String, trim: true },
		name: { type: String, required: true, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		system: { type: String, trim: true },
		condition: { type: String, trim: true },
		warranty: { type: String, trim: true },
		imageUrl: { type: String, trim: true },
		slug: { type: String, required: true, trim: true },
		canonicalUrl: { type: String, trim: true },
		descriptionShort: { type: String, trim: true },
		descriptionText: { type: String, trim: true },
		isTested: { type: Boolean, default: false },
		conditionTag: { type: String, trim: true },
		serialNumber: { type: String, trim: true },
	},
	{ timestamps: true },
);

/**
  Text search index (tek adet)
 */
productSchema.index({
	sku: 'text',
	mpn: 'text',
	name: 'text',
	oem: 'text',
	title: 'text',
	subtitle: 'text',
	descriptionShort: 'text',
});

module.exports = mongoose.model('Product', productSchema);
