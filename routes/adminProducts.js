const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const isAdmin = require('../middleware/isAdmin');
const slugify = require('../utils/slugify');

function clean(v) {
  return String(v || '').trim();
}

function normalizeImageUrl(value) {
  const raw = clean(value);

  if (!raw) return '';

  if (raw.startsWith('/assets/')) {
    return raw;
  }

  if (raw.startsWith('assets/')) {
    return `/${raw}`;
  }

  if (raw.startsWith('/')) {
    return raw;
  }

  return `/assets/images/product/${raw}`;
}

// Ürün listesi 
router.get('/admin/products', isAdmin, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments({});
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.render('admin/products', {
      products,
      email: req.session.email,
      currentPage: page,
      totalPages,
      totalProducts,
      limit
    });
  } catch (err) {
    console.error('Admin products list error:', err);
    res.status(500).send('Ürün listesi alınırken hata oluştu.');
  }
});

// Yeni ürün formu
router.get('/admin/products/new', isAdmin, (req, res) => {
  res.render('admin/product-new', {
    error: null,
    success: null,
    formData: {},
    email: req.session.email
  });
});

// Ürün kaydet
router.post('/admin/products', isAdmin, async (req, res) => {
  try {
    const skuC = clean(req.body.sku);
    const mpnC = clean(req.body.mpn);
    const oemC = clean(req.body.oem);
    const nameC = clean(req.body.name);
    const titleC = clean(req.body.title);
    const subtitleC = clean(req.body.subtitle);
    const systemC = clean(req.body.system);
    const conditionC = clean(req.body.condition);
    const warrantyC = clean(req.body.warranty);
    const imageUrlC = normalizeImageUrl(req.body.imageUrl);
    const descriptionShortC = clean(req.body.descriptionShort);
    const descriptionTextC = clean(req.body.descriptionText);
    const conditionTagC = clean(req.body.conditionTag);
    const serialNumberC = clean(req.body.serialNumber);
    const isTestedC = req.body.isTested === 'on';

    if (!skuC || !nameC) {
      return res.render('admin/product-new', {
        error: 'SKU ve Name alanları zorunludur.',
        success: null,
        formData: req.body,
        email: req.session.email
      });
    }

    const existingProduct = await Product.findOne({ sku: skuC });
    if (existingProduct) {
      return res.render('admin/product-new', {
        error: 'Bu SKU ile kayıtlı bir ürün zaten var.',
        success: null,
        formData: req.body,
        email: req.session.email
      });
    }

    const generatedSlug = `${slugify(nameC)}-${slugify(skuC)}`;
    const canonicalUrl = `/part/${skuC}/${generatedSlug}`;
    const productTitle = titleC || `BugaMed - ${nameC} ${skuC}`;

    await Product.create({
      sku: skuC,
      mpn: mpnC,
      oem: oemC,
      name: nameC,
      title: productTitle,
      subtitle: subtitleC,
      system: systemC,
      condition: conditionC,
      warranty: warrantyC,
      imageUrl: imageUrlC,
      slug: generatedSlug,
      canonicalUrl,
      descriptionShort: descriptionShortC,
      descriptionText: descriptionTextC,
      isTested: isTestedC,
      conditionTag: conditionTagC,
      serialNumber: serialNumberC
    });

    return res.render('admin/product-new', {
      error: null,
      success: 'Ürün başarıyla eklendi.',
      formData: {},
      email: req.session.email
    });
  } catch (err) {
    console.error('Admin product create error:', err);

    return res.render('admin/product-new', {
      error: 'Ürün eklenirken bir hata oluştu.',
      success: null,
      formData: req.body,
      email: req.session.email
    });
  }
});

// Ürün düzenleme formu
router.get('/admin/products/:id/edit', isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).send('Ürün bulunamadı.');
    }

    res.render('admin/product-edit', {
      product,
      error: null,
      success: null,
      email: req.session.email
    });
  } catch (err) {
    console.error('Product edit page error:', err);
    res.status(500).send('Ürün düzenleme sayfası açılırken hata oluştu.');
  }
});

// Ürün güncelle
router.post('/admin/products/:id/update', isAdmin, async (req, res) => {
  try {
    const clean = (v) => String(v || '').trim();

    const skuC = clean(req.body.sku);
    const nameC = clean(req.body.name);

    if (!skuC || !nameC) {
      const product = { ...req.body, _id: req.params.id };

      return res.render('admin/product-edit', {
        product,
        error: 'SKU ve Name alanları zorunludur.',
        success: null,
        email: req.session.email
      });
    }

    const existingProduct = await Product.findOne({
      sku: skuC,
      _id: { $ne: req.params.id }
    });

    if (existingProduct) {
      const product = { ...req.body, _id: req.params.id };

      return res.render('admin/product-edit', {
        product,
        error: 'Bu SKU başka bir üründe kullanılıyor.',
        success: null,
        email: req.session.email
      });
    }

    const generatedSlug = `${slugify(nameC)}-${slugify(skuC)}`;
    const canonicalUrl = `/part/${skuC}/${generatedSlug}`;
    const productTitle = clean(req.body.title) || `BugaMed - ${nameC} ${skuC}`;

    await Product.findByIdAndUpdate(
      req.params.id,
      {
        sku: skuC,
        mpn: clean(req.body.mpn),
        oem: clean(req.body.oem),
        name: nameC,
        title: productTitle,
        subtitle: clean(req.body.subtitle),
        system: clean(req.body.system),
        condition: clean(req.body.condition),
        warranty: clean(req.body.warranty),
        imageUrl: normalizeImageUrl(req.body.imageUrl),
        slug: generatedSlug,
        canonicalUrl,
        descriptionShort: clean(req.body.descriptionShort),
        descriptionText: clean(req.body.descriptionText),
        isTested: req.body.isTested === 'on',
        conditionTag: clean(req.body.conditionTag),
        serialNumber: clean(req.body.serialNumber)
      },
      { runValidators: true }
    );

    res.redirect('/admin/products');
  } catch (err) {
    console.error('Product update error:', err);

    const product = { ...req.body, _id: req.params.id };

    res.render('admin/product-edit', {
      product,
      error: 'Ürün güncellenirken hata oluştu.',
      success: null,
      email: req.session.email
    });
  }
});

// Ürün sil
router.post('/admin/products/:id/delete', isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.redirect('/admin/products');
  } catch (err) {
    console.error('Product delete error:', err);
    res.status(500).send('Silme hatası');
  }
});

module.exports = router;