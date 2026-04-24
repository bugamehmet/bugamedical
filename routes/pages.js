const express = require('express');
const router = express.Router();
const GalleryImage = require('../models/GalleryImage');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/why', (req, res) => {
  res.render('why');
});

router.get('/contactus', (req, res) => {
  res.render('contactus');
});

router.get('/photos', async (req, res) => {
  try {
    const images = await GalleryImage.find({}).sort({ order: 1, createdAt: 1 });

    res.render('photos', {
      images,
      pageTitle: 'BugaMed - MRI & CT Parts | Gallery',
      metaDescription: 'Bugamed Care MRI, CT and X-ray parts & field photos gallery.',
      canonicalUrl: '/photos',
      currentPage: 'photos',
    });
  } catch (err) {
    console.error('Gallery hata:', err);
    res.status(500).send('Something went wrong.');
  }
});

router.get('/mri', (req, res) => {
  res.render('mri');
});

router.get('/rf', (req, res) => {
  res.render('rf');
});

router.get('/tomo', (req, res) => {
  res.render('tomo');
});

router.get('/x-ray', (req, res) => {
  res.render('x-ray');
});

module.exports = router;