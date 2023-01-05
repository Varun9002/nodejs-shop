const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add product',
		path: '/admin/add-product',
		editMode: false,
	});
};

exports.postAddProducts = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const product = new Product(null, title, imageUrl, description, price);
	product.save();
	res.redirect('/');
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('admin/products', {
			pageTitle: 'Admin Products',
			path: '/admin/products',
			prods: products,
		});
	});
};

exports.getEditProducts = (req, res, next) => {
	const editMode = Boolean(req.query.edit);
	if (!editMode) {
		res.redirect('/');
	}
	const prodId = req.params.productId;
	Product.findById(prodId, (product) => {
		res.render('admin/edit-product', {
			pageTitle: 'Add product',
			path: '/admin/add-product',
			product: product,
			editMode: editMode,
		});
	});
};

exports.postEditProduct = (req, res, next) => {
	const id = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedImageUrl = req.body.imageUrl;
	const updatedPrice = req.body.price;
	const updatedDescription = req.body.description;
	const product = new Product(
		id,
		updatedTitle,
		updatedImageUrl,
		updatedDescription,
		updatedPrice
	);
	product.save();
	res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
	const id = req.body.productId;
	Product.delete(id);
	res.redirect('/products');
};
