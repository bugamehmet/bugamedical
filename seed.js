// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  await Product.create({
    sku: "0790H1011D",
    mpn: "0790H1011D",
    oem: "Fuji",
    name: "Fuji MECH Control Board",
    title: "BugaMed - Fuji MECH Control Board 0790H1011D",
    subtitle: "System Model: Fuji MRI Scanner Part",
    system: "Fuji",
    condition: "Used – Tested",
    warranty: "30 Days",
    imageUrl: "/assets/images/product/0790H1011D.jpeg",
    slug: "fuji-mech-control-board-0790H1011D",
    canonicalUrl: "/part/0790H1011D/fuji-mech-control-board-0790H1011D",
    descriptionShort: "Fuji MECH Control Board 0790H1011D. Tested and working spare part for Fuji.",
    descriptionText: "All parts are visually inspected, cleaned, and tested under load before shipping.",
    isTested: true,
    conditionTag: "good",
  });

  console.log("Product eklendi");
  await mongoose.disconnect();
}

run();
