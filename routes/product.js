const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/part/:sku/:slug?', async (req, res) => {
  try {
    const { sku, slug } = req.params;

    const product = await Product.findOne({ sku });

    if (!product) {
      return res.status(404).send('Part not found.');
    }

    if (product.slug && slug !== product.slug) {
      return res.redirect(301, product.canonicalUrl || `/part/${product.sku}/${product.slug}`);
    }

    // 1) Önce ilgili ürünleri random çek
    let relatedProducts = await Product.aggregate([
      {
        $match: {
          _id: { $ne: product._id },
          $or: [{ system: product.system }, { oem: product.oem }],
        },
      },
      { $sample: { size: 3 } },
    ]);

    // 2) 3'ten azsa, eksikleri rastgele başka ürünlerle tamamla
    if (relatedProducts.length < 3) {
      const existingIds = relatedProducts.map((p) => p._id);

      const fillerProducts = await Product.aggregate([
        {
          $match: {
            _id: {
              $nin: [product._id, ...existingIds],
            },
          },
        },
        { $sample: { size: 3 - relatedProducts.length } },
      ]);

      relatedProducts = [...relatedProducts, ...fillerProducts];
    }

    res.render('part-detail', {
      product,
      relatedProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.get('/parts-catalog', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ sku: 1 }); // istersen sıralama

    res.render('parts-catalog', {
      products,
      pageTitle: 'BugaMed - Parts Catalog',
      metaDescription: 'Philips, Toshiba, GE MRI & CT spare parts catalog by BugaMedical.',
      canonicalUrl: '/parts-catalog',
      currentPage: 'parts',
    });
  } catch (err) {
    console.error('Parts catalog hata:', err);
    res.status(500).send('Something went wrong.');
  }
});

module.exports = router;