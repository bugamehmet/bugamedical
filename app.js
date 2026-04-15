// --- ENV mutlaka en üstte olsun ---
require('dotenv').config();

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
const connectDB = require('./db'); // MongoDB bağlantı fonksiyonu
const Product = require('./models/Product');
const GalleryImage = require('./models/GalleryImage');

const app = express();
const port = process.env.PORT || 5001;

// --- MongoDB'ye bağlan ---
connectDB();

// en üste, diğer middleware'lerden ÖNCE
const compression = require('compression');
app.use(compression());

// --- Middleware'ler ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Statik dosyalar
app.use('/assets', express.static('assets'));
app.use(express.static('views'));
app.use(express.static(path.join(__dirname, 'public')));

// EJS ayarı
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- ROUTE'lar ---

//SİTEMAP ROUTE
app.get('/sitemap.xml', async (req, res) => {
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
app.get('/image-sitemap.xml', async (req, res) => {
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

// Part detay sayfaları: /part/45221179529/philips-dga-board-mri
app.get('/part/:sku/:slug?', async (req, res) => {
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

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/parts-catalog', async (req, res) => {
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

app.get('/about', (req, res) => {
	res.render('about');
});

app.get('/why', (req, res) => {
	res.render('why');
});

app.get('/contactus', (req, res) => {
	res.render('contactus');
});

app.get('/photos', async (req, res) => {
	try {
		const images = await GalleryImage.find({}).sort({ order: 1, createdAt: 1 });

		res.render('photos', {
			images,
			pageTitle: 'BugaMed - MRI & CT Parts | Gallery',
			metaDescription: 'Bugamed Care MRI, CT and X-ray parts & field photos gallery.',
			currentPage: 'photos',
		});
	} catch (err) {
		console.error('Gallery hata:', err);
		res.status(500).send('Something went wrong.');
	}
});

app.get('/mri', (req, res) => {
	res.render('mri');
});

app.get('/rf', (req, res) => {
	res.render('rf');
});

app.get('/tomo', (req, res) => {
	res.render('tomo');
});

app.get('/x-ray', (req, res) => {
	res.render('x-ray');
});

function escapeRegex(s) {
	return String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
// ✅ Autocomplete: /api/search-suggest?q=...
app.get('/api/search-suggest', async (req, res) => {
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
app.get('/search', async (req, res) => {
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

// --- Nodemailer ayarları ---
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

// Contact / Request Quote POST
app.post('/send-email', async (req, res) => {
	const {
		name,
		email,
		subject,
		message,
		country, // optional
		source, // optional
		sku, // optional
		productUrl, // optional
	} = req.body || {};

	const clean = (v) => String(v || '').trim();

	const nameC = clean(name);
	const emailC = clean(email);
	const subjectC = clean(subject);
	const messageC = clean(message);

	if (!nameC || !emailC || !subjectC || !messageC) {
		return res.status(400).json({
			success: false,
			message: 'Please fill in the name, email, subject, and message fields.',
		});
	}

	const safe = (v) =>
		String(v || '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');

	const mailOptions = {
		from: `"BugaMed Website" <${process.env.SMTP_USER}>`,
		to: 'bugamedical@gmail.com',
		replyTo: emailC,
		subject: `New Quote Request: ${subjectC}`,
		html: `
      <h3>New Message</h3>

      <p><strong>Name / Company:</strong> ${safe(nameC)}</p>
      <p><strong>Email:</strong> ${safe(emailC)}</p>
      <p><strong>Subject:</strong> ${safe(subjectC)}</p>

      ${country ? `<p><strong>Country:</strong> ${safe(country)}</p>` : ''}
      ${source ? `<p><strong>Source:</strong> ${safe(source)}</p>` : ''}
      ${sku ? `<p><strong>SKU:</strong> ${safe(sku)}</p>` : ''}
      ${productUrl ? `<p><strong>Product URL:</strong> ${safe(productUrl)}</p>` : ''}

      <hr/>

      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${safe(messageC)}</p>
    `,
	};

	try {
		await transporter.sendMail(mailOptions);
		return res.status(200).json({
			success: true,
			message: 'Your email has been sent successfully!',
		});
	} catch (error) {
		// prod’da log kalsın (debug değil, hata logu)
		console.error('E-posta gönderme hatası:', error);
		return res.status(500).json({
			success: false,
			message: 'An error occurred while sending the email. Please try again later.',
		});
	}
});

// --- Sunucuyu başlat ---
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
