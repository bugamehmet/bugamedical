const express = require('express');
const connection = require('./db');
const app = express();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // CORS hatalarını önlemek için
const port = 5001;
require('dotenv').config();

app.use('/assets', express.static('assets'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));
// Middleware'ler
app.use(bodyParser.json()); // Gelen JSON isteklerini ayrıştırmak için
app.use(cors()); // Tüm kaynaklardan gelen isteklere izin vermek için (güvenlik için daha spesifik ayarlanabilir)

app.get('/', (req, res) => {
	res.sendFile(__dirname + 'index.html');
});
app.get('/about', (req, res) => {
	res.sendFile(__dirname + '/views/about.html');
});
app.get('/why', (req, res) => {
	res.sendFile(__dirname + '/views/why-bugamed.html');
});
app.get('/contactus', (req, res) => {
	res.sendFile(__dirname + '/views/contactus.html');
});
app.get('/parts-catalog', (req, res) => {
	res.sendFile(__dirname + '/views/parts-catalog.html');
});
app.get('/photos', (req, res) => {
	res.sendFile(__dirname + '/views/photos.html');
});

// Middleware'ler
app.use(bodyParser.json()); // Gelen JSON isteklerini ayrıştırmak için
app.use(cors()); // Tüm kaynaklardan gelen isteklere izin vermek için (güvenlik için daha spesifik ayarlanabilir)

// E-posta gönderimini yapılandırma (Gmail örneği)
// Kendi e-posta servis sağlayıcınızın SMTP bilgilerini buraya girin.
// Gmail için 'Daha az güvenli uygulama erişimi'ni açmanız veya uygulama şifresi kullanmanız gerekebilir.
const transporter = nodemailer.createTransport({
	service: 'gmail', // veya 'Outlook', 'Yahoo' vb.
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

// İletişim formu gönderimlerini işleyecek POST endpoint'i
app.post('/send-email', async (req, res) => {
	const { name, email, subject, country } = req.body;
	console.log(name, email, subject, country);
	console.log('Transporter User:', transporter.options.auth.user);
	console.log('Transporter Pass:', transporter.options.auth.pass);

	// Gelen verileri kontrol et
	if (!name || !email || !subject || !country) {
		return res.status(400).json({ success: false, message: 'Lütfen tüm alanları doldurun.' });
	}

	// E-posta içeriği
	const mailOptions = {
		from: `"${name}" <${email}>`, // Gönderen adı ve e-posta adresi
		to: 'bugamedical@gmail.com', // E-postanın gönderileceği adres (kendi adresiniz olabilir)
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
		// E-postayı gönder
		await transporter.sendMail(mailOptions);
		console.log('E-posta başarıyla gönderildi!');
		res.sendFile(__dirname + '/views/contactus.html');
	} catch (error) {
		console.error('E-posta gönderme hatası:', error);
		res.status(500).json({ success: false, message: 'E-posta gönderilirken bir hata oluştu.' });
		app.get('/send-email', (req, res) => {
			res.sendFile(__dirname + '/views/contactus.html');
		});
	}
});

/*
const parts_query = 'SELECT products.product_name, parts.part_name FROM products INNER JOIN parts ON products.product_id = parts.product_id'

connection.query(parts_query, (err, parts)=>{
  if(err){throw err}
  console.log(parts)
})
*/

app.listen(port, (error) => {
	if (error) {
		throw error;
	}
	console.log(`Server http://localhost:${port} adresinde başladı`);
});
