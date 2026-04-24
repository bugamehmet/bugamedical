const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// --- Nodemailer ayarları ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact / Request Quote POST
router.post('/send-email', async (req, res) => {
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

module.exports = router;