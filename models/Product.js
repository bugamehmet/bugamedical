// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true, index: true },
  mpn: { type: String, index: true },
  oem: String,
  name: String,
  title: String,
  subtitle: String,
  system: String,
  condition: String,
  warranty: String,
  imageUrl: String,
  slug: String,
  canonicalUrl: String,
  descriptionShort: String,
  descriptionText: String,
  isTested: Boolean,
  conditionTag: String,
  serialNumber: String,
});

/**
 * ✅ Text search index (tek adet)
 * - MongoDB text search için gerekli
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
