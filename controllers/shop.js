const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render('shop/product-list', {
				pageTitle: 'All Products',
				path: '/products',
				prods: products,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then((product) => {
			res.render('shop/product-detail', {
				pageTitle: product.title,
				path: '/products',
				product: product,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render('shop/index', {
				pageTitle: 'Shop',
				path: '/',
				prods: products,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getCart = (req, res, next) => {
	req.user.getCart().then((cart) => {
		res.render('shop/cart', {
			pageTitle: 'Your cart',
			path: '/cart',
			products: cart,
		});
	});
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then(() => {
			res.redirect('/cart');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postCartDeleteItem = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.deleteProductFromCart(prodId)
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getOrders = (req, res, next) => {
	req.user
		.getOrders()
		.then((orders) => {
			res.render('shop/orders', {
				pageTitle: 'Orders',
				path: '/orders',
				orders: orders,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// exports.getCheckout = (req, res, next) => {
// 	res.render('shop/checkout', {
// 		pageTitle: 'Checkout',
// 		path: '/checkout',
// 	});
// };

exports.postOrders = (req, res, next) => {
	req.user
		.addOrder()
		.then((result) => {
			res.redirect('/orders');
		})
		.catch((err) => {
			console.log(err);
		});

	// let fetchedCart;
	// req.user
	// 	.getCart()
	// 	.then((cart) => {
	// 		fetchedCart = cart;
	// 		return cart.getProducts();
	// 	})
	// 	.then((products) => {
	// 		return req.user
	// 			.createOrder()
	// 			.then((order) => {
	// 				return order.addProducts(
	// 					products.map((product) => {
	// 						product.orderItem = {
	// 							quantity: product.cartItem.quantity,
	// 						};
	// 						return product;
	// 					})
	// 				);
	// 			})
	// 			.catch((err) => {
	// 				console.log(err);
	// 			});
	// 	})
	// 	.then((result) => {
	// 		fetchedCart.setProducts(null);
	// 	})
	// 	.then((result) => {
	// 		res.redirect('/orders');
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// });
};
