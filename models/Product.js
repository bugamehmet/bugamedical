// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  mpn: String,
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

module.exports = mongoose.model('Product', productSchema);
