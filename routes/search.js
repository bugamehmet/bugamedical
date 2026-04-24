const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

function escapeRegex(s) {
  return String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/api/search-suggest', async (req, res) => {
  try {
    const qRaw = String(req.query.q || '').trim();
    if (!qRaw || qRaw.length < 2) return res.json({ ok: true, items: [] });

    const q = qRaw.slice(0, 50);
    const escaped = escapeRegex(q);
    const rxPrefix = new RegExp('^' + escaped, 'i');
    const rxAny = new RegExp(escaped, 'i');

    const projection = { sku: 1, mpn: 1, name: 1, oem: 1, canonicalUrl: 1, slug: 1 };

    // 1) SKU/MPN prefix match
    const a = await Product.find({ $or: [{ sku: rxPrefix }, { mpn: rxPrefix }] }, projection)
      .limit(8)
      .lean();

    // 2) Name/OEM prefix match
    const b = await Product.find({ $or: [{ name: rxPrefix }, { oem: rxPrefix }] }, projection)
      .limit(8)
      .lean();

    let merged = [...a, ...b];

    // 3) Azsa any-match fallback
    if (merged.length < 8) {
      const c = await Product.find(
        { $or: [{ sku: rxAny }, { mpn: rxAny }, { name: rxAny }, { oem: rxAny }] },
        projection,
      )
        .limit(8)
        .lean();

      merged = merged.concat(c);
    }

    // Unique by sku + limit 8
    const map = new Map();
    for (const p of merged) {
      if (!p?.sku) continue;
      if (!map.has(p.sku)) map.set(p.sku, p);
      if (map.size >= 8) break;
    }

    const items = Array.from(map.values()).map((p) => ({
      sku: p.sku,
      mpn: p.mpn || '',
      name: p.name || '',
      oem: p.oem || '',
      url: p.canonicalUrl || `/part/${p.sku}/${p.slug || ''}`,
    }));

    return res.json({ ok: true, items });
  } catch (err) {
    console.error('search-suggest error:', err);
    return res.status(500).json({ ok: false, items: [] });
  }
});
// ✅ Search page: /search?q=...
router.get('/search', async (req, res) => {
  try {
    const qRaw = String(req.query.q || '').trim();
    const q = qRaw.slice(0, 80);

    if (!q) {
      return res.render('search', {
        products: [],
        total: 0,
        searchQuery: '',
        pageTitle: 'BugaMed - Search',
        metaDescription: 'Search parts by SKU, MPN or Name',
        canonicalUrl: '/search',
        currentPage: 'parts',
      });
    }

    // 1) exact sku/mpn hızlı kontrol
    let products = await Product.find(
      { $or: [{ sku: q }, { mpn: q }] },
      {
        sku: 1,
        mpn: 1,
        oem: 1,
        name: 1,
        imageUrl: 1,
        slug: 1,
        canonicalUrl: 1,
        descriptionShort: 1,
      },
    )
      .limit(30)
      .lean();

    // 2) text search (index varsa)
    if (!products.length) {
      try {
        products = await Product.find(
          { $text: { $search: q } },
          {
            score: { $meta: 'textScore' },
            sku: 1,
            mpn: 1,
            oem: 1,
            name: 1,
            imageUrl: 1,
            slug: 1,
            canonicalUrl: 1,
            descriptionShort: 1,
          },
        )
          .sort({ score: { $meta: 'textScore' } })
          .limit(30)
          .lean();
      } catch (e) {
        // text index yoksa buraya düşebilir -> regex fallback
        products = [];
      }
    }

    // 3) regex fallback
    if (!products.length) {
      const escaped = escapeRegex(q);
      const rx = new RegExp(escaped, 'i');

      products = await Product.find(
        { $or: [{ sku: rx }, { mpn: rx }, { name: rx }, { oem: rx }] },
        {
          sku: 1,
          mpn: 1,
          oem: 1,
          name: 1,
          imageUrl: 1,
          slug: 1,
          canonicalUrl: 1,
          descriptionShort: 1,
        },
      )
        .limit(30)
        .lean();
    }

    products = products.map((p) => ({
      ...p,
      canonicalUrl: p.canonicalUrl || `/part/${p.sku}/${p.slug || ''}`,
    }));

    return res.render('search', {
      products,
      total: products.length,
      searchQuery: q,
      pageTitle: `BugaMed - Search: ${q}`,
      metaDescription: `Search results for ${q}`,
      canonicalUrl: `/search?q=${encodeURIComponent(q)}`,
      currentPage: 'parts',
    });
  } catch (err) {
    console.error('search page error:', err);
    return res.status(500).send('Internal server error');
  }
});
module.exports = router;