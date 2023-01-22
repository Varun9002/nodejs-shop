const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
	let msg = req.flash('error');
	msg = msg.length > 0 ? msg[0] : null;
	res.render('auth/login', {
		pageTitle: 'Login',
		path: '/login',
		errorMsg: msg,
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				req.flash('error', 'Incorrect Email or password');
				return req.session.save((err) => {
					res.redirect('/login');
				});
			}
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.user = user;
						req.session.isLoggedIn = true;
						return req.session.save((err) => {
							console.log(err);
							res.redirect('/');
						});
					}
					req.flash('error', 'Incorrect Email or password');
					req.session.save((err) => {
						res.redirect('/login');
					});
				})
				.catch((err) => {
					console.log(err);
					req.session.save((err) => {
						res.redirect('/login');
					});
				});
		})
		.catch((err) => {
			console.log(err);
		});
};
exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};

exports.getSignup = (req, res, next) => {
	let msg = req.flash('error');
	msg = msg.length > 0 ? msg[0] : null;
	res.render('auth/signup', {
		pageTitle: 'Signup',
		path: '/signup',
		isAuth: false,
		errorMsg: msg,
	});
};
exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	User.findOne({ email: email })
		.then((userDoc) => {
			if (userDoc) {
				req.flash('error', 'Email already exists');
				return req.session.save((err) => {
					res.redirect('/signup');
				});
			}
			return bcrypt
				.hash(password, 12)
				.then((hashedPassword) => {
					const user = new User({
						email: email,
						password: hashedPassword,
						cart: { items: [] },
					});
					return user.save();
				})
				.then((result) => {
					res.redirect('/signup');
				});
		})
		.catch((err) => {
			console.log(err);
		});
};
