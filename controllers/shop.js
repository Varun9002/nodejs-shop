const Order = require('../models/Order');
const Product = require('../models/product');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
exports.getProducts = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('shop/product-list', {
				pageTitle: 'All Products',
				path: '/products',
				prods: products,
				isAuth: req.session.isLoggedIn,
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
				isAuth: req.session.isLoggedIn,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getIndex = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('shop/index', {
				pageTitle: 'Shop',
				path: '/',
				prods: products,
				isAuth: req.session.isLoggedIn,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getCart = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.then((user) => {
			const products = user.cart.items;
			res.render('shop/cart', {
				pageTitle: 'Your cart',
				path: '/cart',
				products: products,
				isAuth: req.session.isLoggedIn,
			});
		})
		.catch((err) => {
			console.log(err);
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
	Order.find({ 'user.userId': req.user._id })
		.then((orders) => {
			res.render('shop/orders', {
				pageTitle: 'Orders',
				path: '/orders',
				orders: orders,
				isAuth: req.session.isLoggedIn,
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
		.populate('cart.items.productId')
		.then((user) => {
			const products = user.cart.items.map((i) => {
				return {
					quantity: i.quantity,
					product: { ...i.productId._doc },
				};
			});
			const order = new Order({
				user: { email: req.user.email, userId: req.user },
				products: products,
			});
			return order.save();
		})
		.then((result) => {
			return req.user.clearCart();
		})
		.then(() => {
			res.redirect('/orders');
		})
		.catch((err) => {
			console.log(err);
		});
};
// req.user
// 	.addOrder()
//

exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;
	Order.findById(orderId)
		.then((order) => {
			if (!order) {
				return next(new Error('No Order found.'));
			}
			if (req.user._id.toString() !== order.user.userId.toString()) {
				return next(new Error('Unauthorized'));
			}
			const invoiceName = 'invoice-' + orderId + '.pdf';
			const invoicePath = path.join('data', 'invoices', invoiceName);
			const pdf = new PDFDocument();
			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader(
				'Content-Disposition',
				'inlline; filename="' + invoiceName + '"'
			);
			pdf.pipe(fs.createWriteStream(invoicePath));
			pdf.pipe(res);
			pdf.fontSize(26).text('Invoice', { underline: true });
			pdf.text('_______________________________');
			pdf.text(' ');
			let totalPrice = 0;
			order.products.forEach((prod) => {
				pdf.fontSize(14).text(
					prod.product.title +
						' - ' +
						prod.quantity +
						' x ' +
						'$' +
						prod.product.price
				);
				totalPrice += prod.quantity * prod.product.price;
			});
			pdf.text('_________________________________');
			pdf.fontSize(20).text('Total Price: $' + totalPrice);
			pdf.end();
			// fs.readFile(invoicePath, (err, data) => {
			// 	if (err) {
			// 		console.log(err);
			// 		return next(err);
			// 	}
			// 	res.setHeader('Content-Type', 'application/pdf');
			// 	res.setHeader(
			// 		'Content-Disposition',
			// 		'attachment; filename="' + invoiceName + '"'
			// 	);
			// 	res.send(data);
			// });
			// const file = fs.createReadStream(invoicePath);
			// res.setHeader('Content-Type', 'application/pdf');
			//res.setHeader(
			// 		'Content-Disposition',
			// 		'attachment; filename="' + invoiceName + '"'
			// 	);
			// file.pipe(res);
		})
		.catch((err) => next(err));
};
