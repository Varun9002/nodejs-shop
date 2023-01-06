const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then(([rows, feildData]) => {
			res.render('shop/product-list', {
				pageTitle: 'All Products',
				path: '/products',
				prods: rows,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getProduct = (req, res, next) => {
	const prodId = +req.params.productId;
	Product.findById(prodId)
		.then(([product]) => {
			res.render('shop/product-detail', {
				pageTitle: product[0].title,
				path: '/products',
				product: product[0],
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll()
		.then(([rows, feildData]) => {
			res.render('shop/index', {
				pageTitle: 'Admin Products',
				path: '/',
				prods: rows,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getCart = (req, res, next) => {
	Cart.getCart((cart) => {
		Product.fetchAll((products) => {
			const cartProducts = [];
			for (product of products) {
				const cartProductData = cart.products.find(
					(prod) => prod.id === product.id
				);
				if (cartProductData) {
					cartProducts.push({
						productData: product,
						qty: cartProductData.qty,
					});
				}
			}
			res.render('shop/cart', {
				pageTitle: 'Your cart',
				path: '/cart',
				products: cartProducts,
			});
		});
	});
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, (product) => {
		Cart.addProduct(prodId, product.price);
	});
	res.redirect('/cart');
};
exports.postCartDeleteItem = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, (product) => {
		Cart.deleteProduct(prodId, product.price);
	});
	res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		pageTitle: 'Orders',
		path: '/orders',
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		pageTitle: 'Checkout',
		path: '/checkout',
	});
};
