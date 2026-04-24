const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

//SİTEMAP ROUTE
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://www.bugamed.care';

    const staticPages = [
      '/',
      '/about',
      '/why',
      '/contactus',
      '/photos',
      '/parts-catalog',
      '/search',
    ];

    const products = await Product.find(
      {},
      {
        sku: 1,
        slug: 1,
        canonicalUrl: 1,
        updatedAt: 1,
      },
    ).lean();

    const staticUrls = staticPages.map(
      (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    );

    const productUrls = products.map(
      (product) => `
  <url>
    <loc>${
      product.canonicalUrl
        ? `${baseUrl}${product.canonicalUrl}`
        : `${baseUrl}/part/${product.sku}/${product.slug || ''}`
    }</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`,
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...productUrls].join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap error:', err);
    res.status(500).send('Failed to generate sitemap');
  }
});
// İMAGE SITEMAP ROUTE
router.get('/image-sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://www.bugamed.care';

    const products = await Product.find(
      {},
      {
        canonicalUrl: 1,
        sku: 1,
        slug: 1,
        imageUrl: 1,
        name: 1,
      },
    ).lean();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${products
  .map(
    (product) => `
  <url>
    <loc>${
      product.canonicalUrl
        ? `${baseUrl}${product.canonicalUrl}`
        : `${baseUrl}/part/${product.sku}/${product.slug || ''}`
    }</loc>
    <image:image>
      <image:loc>${baseUrl}${product.imageUrl}</image:loc>
      <image:title><![CDATA[${product.name || product.sku}]]></image:title>
    </image:image>
  </url>
`,
  )
  .join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Image sitemap error:', err);
    res.status(500).send('Failed to generate image sitemap');
  }
});

module.exports = router; 