const express = require('express');
const rootDir = require('../util/path');
const path = require('path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
	res.render('add-product', {
		pageTitle: 'Add product',
		path: '/admin/add-products',
		productCSS: true,
		formCSS: true,
		activeProduct: true,
	});
	// res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res, next) => {
	products.push({ title: req.body.title });
	res.redirect('/');
});

exports.routes = router;
exports.products = products;
