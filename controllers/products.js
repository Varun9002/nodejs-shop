const Product = require('./../models/product');

exports.getAddProducts = (req, res, next) => {
	res.render('add-product', {
		pageTitle: 'Add product',
		path: '/admin/add-product',
		productCSS: true,
		formCSS: true,
		activeProduct: true,
	});
};

exports.postAddProducts = (req, res, next) => {
	const product = new Product(req.body.title);
	product.save();
	res.redirect('/');
};

exports.getShop = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('shop', {
			pageTitle: 'Shop',
			path: '/',
			prods: products,
			hasProds: products,
			activeShop: true,
			productCSS: true,
		});
	});
	// res.sendFile(path.join(rootDir, 'views', 'shop.html'));
};
