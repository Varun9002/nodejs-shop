const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.findAll()
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
	const prodId = +req.params.productId;
	Product.findAll({ where: { id: prodId } })
		.then((product) => {
			res.render('shop/product-detail', {
				pageTitle: product[0].title,
				path: '/products',
				product: product[0],
			});
		})
		.catch((err) => {
			console.log(err);
		});

	// Product.findByPk(prodId)
	// 	.then((product) => {
	// 		res.render('shop/product-detail', {
	// 			pageTitle: product.title,
	// 			path: '/products',
	// 			product: product,
	// 		});
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});
};

exports.getIndex = (req, res, next) => {
	Product.findAll()
		.then((products) => {
			res.render('shop/index', {
				pageTitle: 'Admin Products',
				path: '/',
				prods: products,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getCart = (req, res, next) => {
	req.user
		.getCart()
		.then((cart) => {
			return cart.getProducts();
		})
		.then((products) => {
			res.render('shop/cart', {
				pageTitle: 'Your cart',
				path: '/cart',
				products: products,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	let fetchedCart;
	let newQuantity = 1;
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			return cart.getProducts({ where: { id: prodId } });
		})
		.then((products) => {
			let product;
			if (products.length > 0) {
				product = products[0];
			}
			if (product) {
				newQuantity = product.cartItem.quantity + 1;
				return product;
			}
			return Product.findByPk(prodId);
		})
		.then((product) => {
			console.log(fetchedCart);
			fetchedCart.addProduct(product, {
				through: { quantity: newQuantity },
			});
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
		.getCart()
		.then((cart) => {
			return cart.getProducts({ where: { id: prodId } });
		})
		.then((products) => {
			const product = products[0];
			return product.cartItem.destroy();
		})
		.then(() => {
			res.redirect('/cart');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getOrders = (req, res, next) => {
	req.user
		.getOrders({ include: ['products'] })
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

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		pageTitle: 'Checkout',
		path: '/checkout',
	});
};

exports.postOrders = (req, res, next) => {
	let fetchedCart;
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			return cart.getProducts();
		})
		.then((products) => {
			return req.user
				.createOrder()
				.then((order) => {
					return order.addProducts(
						products.map((product) => {
							product.orderItem = {
								quantity: product.cartItem.quantity,
							};
							return product;
						})
					);
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.then((result) => {
			fetchedCart.setProducts(null);
		})
		.then((result) => {
			res.redirect('/orders');
		})
		.catch((err) => {
			console.log(err);
		});
};
