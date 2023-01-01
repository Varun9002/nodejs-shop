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
		hasProds: adminData.products.length > 0,
		activeShop: true,
		productCSS: true,
	});
	// res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
