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
	req.user
		.createProduct({
			title: title,
			price: price,
			imageUrl: imageUrl,
			description: description,
		})
		.then((result) => {
			console.log(result);
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getProducts = (req, res, next) => {
	// Product.findAll()
	req.user
		.getProducts()
		.then((products) => {
			res.render('admin/products', {
				pageTitle: 'Admin Products',
				path: '/admin/products',
				prods: products,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getEditProducts = (req, res, next) => {
	const editMode = Boolean(req.query.edit);
	if (!editMode) {
		res.redirect('/');
	}
	const prodId = req.params.productId;
	req.user
		.getProducts({ where: { id: prodId } })
		// Product.findByPk(prodId)
		.then((products) => {
			const product = products[0];
			if (!product) {
				res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit product',
				path: '/admin/edit-product',
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

	Product.findByPk(id)
		.then((product) => {
			product.title = updatedTitle;
			product.imageUrl = updatedImageUrl;
			product.price = updatedPrice;
			product.description = updatedDescription;
			return product.save();
		})
		.then((result) => {
			console.log('Updated Product');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postDeleteProduct = (req, res, next) => {
	const id = req.body.productId;
	Product.findByPk(id)
		.then((product) => {
			return product.destroy();
		})
		.then((result) => {
			console.log('Destroyed a product');
			res.redirect('/products');
		})
		.catch((err) => {
			console.log(err);
		});
};
