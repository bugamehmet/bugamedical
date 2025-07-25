const express = require('express');
const mysql = require('mysql');
const connection = require('./db');
const app = express();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // CORS hatalarını önlemek için
const port = process.env.PORT || 10000; 
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

app.post('/send-email', async (req, res) => { // Bu rota muhtemelen bir POST rotası olacak
  const { name, email, subject, country } = req.body; // body-parser veya express.json ile gelen veriler

  // 1. Alan Doğrulaması
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
    // 2. E-posta Gönderme
    await transporter.sendMail(mailOptions);
    console.log('E-posta başarıyla gönderildi!');
    // Başarılı olduğunda da JSON yanıtı gönderin
    return res.status(200).json({ success: true, message: 'E-postanız başarıyla gönderildi!' });

  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    // E-posta gönderme hatası olduğunda da JSON yanıtı gönderin
    return res.status(500).json({ success: false, message: 'E-posta gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.' });
  }
});

// Ayrıca contactus.html dosyasını sunan bir GET rotasına ihtiyacınız olacak
app.get('/contactus', (req, res) => {
  res.sendFile(__dirname + '/views/contactus.html');
});

app.listen(port, '0.0.0.0', () => { // Hostu 0.0.0.0 olarak ayarlayın
    console.log(`Server is running on port ${port}`);
});
/*
const parts_query = 'SELECT products.product_name, parts.part_name FROM products INNER JOIN parts ON products.product_id = parts.product_id'

connection.query(parts_query, (err, parts)=>{
  if(err){throw err}
  console.log(parts)
})
*/
/*
app.listen(port, (error) => {
	if (error) {
		throw error;
	}
	console.log(`Server http://localhost:${port} adresinde başladı`);
});
*/
