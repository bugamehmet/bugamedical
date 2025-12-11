// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  await Product.create({
    sku: "45221179529",
    mpn: "45221179529",
    oem: "Philips",
    name: "Philips DGA Board MRI",
    title: "BugaMed - Philips DGA Board MRI 45221179529",
    subtitle: "1.5T MRI Scanner Parts P/N 45221179529",
    system: "Philips 1.5T MRI Scanner Part",
    condition: "Used – Tested",
    warranty: "30 Days",
    imageUrl: "/assets/images/product/45221179529.jpeg",
    slug: "philips-dga-board-mri",
    canonicalUrl: "/part/45221179529/philips-dga-board-mri",
    descriptionShort: "Philips DGA Board MRI 45221179529. Tested and working spare part for Philips 1.5T MRI systems.",
    descriptionText: "All boards are visually inspected, cleaned, and tested under load before shipping.",
    isTested: true,
    conditionTag: "good",
  });

  console.log("Product eklendi");
  await mongoose.disconnect();
}

run();
