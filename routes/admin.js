const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const { getSearchData } = require('../services/searchConsole');

router.get('/admin/login', (req, res) => {
	res.render('admin/login', { error: req.query.error });
});

router.get('/admin/seo', isAdmin, async (req, res) => {
	try {
		const range = req.query.range || '7';

		const endDate = new Date();
		const startDate = new Date();

		if (range === '7') startDate.setDate(endDate.getDate() - 7);
		if (range === '28') startDate.setDate(endDate.getDate() - 28);
		if (range === '90') startDate.setDate(endDate.getDate() - 90);

		const formatDate = (d) => d.toISOString().split('T')[0];

		const data = await getSearchData(
			process.env.GSC_SITE_URL,
			formatDate(startDate),
			formatDate(endDate),
      range
		);

		res.render('admin/seo', {
			data,
			error: null,
			email: req.session.email,
			range
		});
	} catch (err) {
		console.log('--- ADMIN SEO ERROR START ---');
		console.log('message:', err.message);
		console.log('errors:', err.errors);
		console.log('response data:', err.response?.data);
		console.log('full error:', err);
		console.log('--- ADMIN SEO ERROR END ---');

		res.render('admin/seo', {
			data: [],
			error: err.message || 'Search Console verisi alınamadı.',
			email: req.session.email,
			range
		});
	}
});

module.exports = router;
