const { validationResult } = require('express-validator/check');
const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editMode: false,
		hasError: false,
		errorMsg: null,
	});
};

exports.postAddProducts = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const error = validationResult(req);
	if (!error.isEmpty()) {
		console.log(error);
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add product',
			path: '/admin/edit-product',
			editMode: false,
			hasError: true,
			product: {
				title: title,
				price: price,
				imageUrl: imageUrl,
				description: description,
			},
			errorMsg: error.array()[0].msg,
		});
	}
	const product = new Product({
		title: title,
		imageUrl: imageUrl,
		price: price,
		description: description,
		userId: req.user,
	});
	product
		.save()
		.then((result) => {
			console.log('Product Created');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getProducts = (req, res, next) => {
	Product.find({ userId: req.user._id })
		// .select('title price -_id')
		// .populate('userId', 'name')a
		.then((products) => {
			res.render('admin/products', {
				pageTitle: 'Admin Products',
				path: '/admin/products',
				prods: products,
				isAuth: req.session.isLoggedIn,
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
	// Product.findById(prodId)
	Product.findOne({ _id: prodId, userId: req.user._id })
		.then((product) => {
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit product',
				path: '/admin/edit-product',
				product: product,
				editMode: editMode,
				hasError: false,
				errorMsg: null,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postEditProduct = (req, res, next) => {
	const id = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedImageUrl = req.body.imageUrl;
	const updatedPrice = req.body.price;
	const updatedDescription = req.body.description;
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Edit product',
			path: '/admin/edit-product',
			editMode: true,
			hasError: true,
			product: {
				title: updatedTitle,
				price: updatedPrice,
				imageUrl: updatedImageUrl,
				description: updatedDescription,
				_id: id,
			},
			errorMsg: error.array()[0].msg,
		});
	}
	return Product.findById(id)
		.then((product) => {
			if (product.userId.toString() !== req.user._id.toString()) {
				return res.redirect('/');
			}
			product.title = updatedTitle;
			product.imageUrl = updatedImageUrl;
			product.description = updatedDescription;
			product.price = updatedPrice;
			return product.save().then((result) => {
				console.log('Updated Product');
				res.redirect('/admin/products');
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postDeleteProduct = (req, res, next) => {
	const id = req.body.productId;
	Product.deleteOne({ _id: id, userId: req.user._id })
		.then((result) => {
			console.log('Product Deleted');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};
