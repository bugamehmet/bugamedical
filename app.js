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

// Part detay sayfaları: /part/45221179529/philips-dga-board-mri
app.get('/part/:sku/:slug?', async (req, res) => {
	try {
		const { sku, slug } = req.params;

		// MongoDB'den ürünü bul
		const product = await Product.findOne({ sku });

		if (!product) {
			console.log('Product not found for SKU:', sku);
			return res.status(404).send('Part not found.');
		}

		// SEO için: slug uyuşmuyorsa canonical slug'a yönlendirebilirsin (opsiyonel)
		if (product.slug && slug !== product.slug) {
			return res.redirect(301, product.canonicalUrl || `/part/${product.sku}/${product.slug}`);
		}

		// EJS template render
		res.render('part-detail', { product });
	} catch (err) {
		console.error('Error in /part route:', err);
		res.status(500).send('Internal server error');
	}
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
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
	res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/why', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'why-bugamed.html'));
});

app.get('/contactus', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'contactus.html'));
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

// --- Nodemailer ayarları ---
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

// İletişim / Request Quote POST rotası
app.post('/send-email', async (req, res) => {
	const { name, email, subject, country } = req.body;

	if (!name || !email || !subject || !country) {
		return res.status(400).json({ success: false, message: 'Lütfen tüm alanları doldurun.' });
	}

	const mailOptions = {
		from: `"${name}" <${email}>`,
		to: 'bugamedical@gmail.com',
		subject: `Yeni İletişim Formu Mesajı: ${subject}`,
		html: `
            <p><strong>Ad Soyad:</strong> ${name}</p>
            <p><strong>E-posta:</strong> ${email}</p>
            <p><strong>Konu:</strong> ${subject}</p>
            <p><strong>Mesaj:</strong></p>
            <p>${country}</p>
        `,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log('E-posta başarıyla gönderildi!');
		return res.status(200).json({ success: true, message: 'E-postanız başarıyla gönderildi!' });
	} catch (error) {
		console.error('E-posta gönderme hatası:', error);
		return res.status(500).json({
			success: false,
			message: 'E-posta gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
		});
	}
});

// --- Sunucuyu başlat ---
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
