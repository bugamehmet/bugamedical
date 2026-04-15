// scripts/convert-images.js
const sharp = require('sharp');
const path = require('path');

// Banner
sharp('./assets/images/home-banner.png')
  .resize(1400, 300)
  .webp({ quality: 82 })
  .toFile('./assets/images/home-banner.webp');

// Logo
sharp('./assets/images/buga-logo.png')
  .resize(104, 104)  // 2x için (52px * 2)
  .webp({ quality: 90 })
  .toFile('./assets/images/buga-logo.webp');