const { validationResult } = require('express-validator/check');
const Product = require('../models/product');
const fileHelper = require('../util/file');

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
	const image = req.file;
	const price = req.body.price;
	const description = req.body.description;
	const error = validationResult(req);
	if (!image) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add product',
			path: '/admin/edit-product',
			editMode: false,
			hasError: true,
			product: {
				title: title,
				price: price,
				description: description,
			},
			errorMsg: 'Attached file is not an image',
		});
	}
	const imageUrl = image.path;

	if (!error.isEmpty()) {
		fileHelper.deleteFile(imageUrl);
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add product',
			path: '/admin/edit-product',
			editMode: false,
			hasError: true,
			product: {
				title: title,
				price: price,
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
			res.redirect('/admin/products');
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
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
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
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
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postEditProduct = (req, res, next) => {
	const id = req.body.productId;
	const updatedTitle = req.body.title;
	const image = req.file;
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
			if (image) {
				fileHelper.deleteFile(product.imageUrl);
				product.imageUrl = image.path;
			}
			product.description = updatedDescription;
			product.price = updatedPrice;
			return product.save().then((result) => {
				console.log('Updated Product');
				res.redirect('/admin/products');
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postDeleteProduct = (req, res, next) => {
	const id = req.body.productId;
	Product.findById(id)
		.then((prod) => {
			if (!prod) {
				return new Error('Product not found.');
			}
			fileHelper.deleteFile(prod.imageUrl);
			return Product.deleteOne({ _id: id, userId: req.user._id });
		})
		.then((result) => {
			console.log('Product Deleted');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};
