const { ObjectId } = require('mongodb');
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
	Product.find()
		// .select('title price -_id')
		// .populate('userId', 'name')
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
	Product.findById(prodId).then((product) => {
		if (!product) {
			res.redirect('/');
		}
		console.log(product);
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

	return Product.findById(id)
		.then((product) => {
			product.title = updatedTitle;
			product.imageUrl = updatedImageUrl;
			product.description = updatedDescription;
			product.price = updatedPrice;
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
	Product.findByIdAndRemove(id)
		.then((result) => {
			console.log('Product Deleted');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};
