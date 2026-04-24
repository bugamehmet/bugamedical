const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const Token = require('../models/Token');
const oauth2Client = require('../services/googleAuth');

const SCOPES = [
	'https://www.googleapis.com/auth/webmasters.readonly',
	'https://www.googleapis.com/auth/userinfo.email',
];

// Google'a yönlendir
router.get('/auth/google', (req, res) => {
	const url = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		prompt: 'consent',
		scope: SCOPES,
	});

	res.redirect(url);
});

// Google callback
router.get('/auth/google/callback', async (req, res) => {
	try {
		const { tokens } = await oauth2Client.getToken(req.query.code);
		oauth2Client.setCredentials(tokens);

		const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
		const { data } = await oauth2.userinfo.get();

		if (data.email !== process.env.ADMIN_EMAIL) {
			return res.status(403).send('Yetkisiz erişim');
		}

		const existingToken = await Token.findOne({});

		await Token.findOneAndUpdate(
			{},
			{
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token || existingToken?.refresh_token,
				scope: tokens.scope,
				token_type: tokens.token_type,
				expiry_date: tokens.expiry_date,
				updatedAt: new Date(),
			},
			{ upsert: true, returnDocument: 'after' },
		);

		req.session.isAdmin = true;
		req.session.email = data.email;

		res.redirect('/admin/seo');
	} catch (err) {
		console.error('Google callback error:', err.response?.data || err.message || err);
		res.redirect('/admin/login?error=1');
	}
});

router.get('/auth/logout', (req, res) => {
	req.session.destroy(() => {
		res.redirect('/admin/login');
	});
});

module.exports = router;
