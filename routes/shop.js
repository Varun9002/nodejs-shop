const express = require('express');
const rootDir = require('../util/path');
const path = require('path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
	res.render('shop', {
		pageTitle: 'Shop',
		path: '/',
		prods: adminData.products,
	});
	// res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
