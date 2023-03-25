const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');

const transporter = nodeMailer.createTransport({
	//Only trans
	host: 'smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: 'c9ef2c25fad1ab',
		pass: '12bd5dbc1194d5',
	},
});

exports.getLogin = (req, res, next) => {
	let msg = req.flash('error');
	msg = msg.length > 0 ? msg[0] : null;
	res.render('auth/login', {
		pageTitle: 'Login',
		path: '/login',
		errorMsg: msg,
		oldData: { email: '', password: '' },
		validationErrors: [],
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(422).render('auth/login', {
			pageTitle: 'Login',
			path: '/login',
			errorMsg: error.array()[0].msg,
			oldData: { email: email, password: password },
		});
	}

	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				return res.status(422).render('auth/login', {
					pageTitle: 'Login',
					path: '/login',
					errorMsg: 'Incorrect Email or password',
					oldData: { email: email, password: password },
				});
			}
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.user = user;
						req.session.isLoggedIn = true;
						return req.session.save((err) => {
							res.redirect('/');
						});
					}
					return res.status(422).render('auth/login', {
						pageTitle: 'Login',
						path: '/login',
						errorMsg: 'Incorrect Email or password',
						oldData: { email: email, password: password },
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
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
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
		oldData: { email: '', password: '' },
		validationErrors: [],
	});
};
exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	const error = validationResult(req);
	if (!error.isEmpty()) {
		console.log(error);
		return res.status(422).render('auth/signup', {
			pageTitle: 'Signup',
			path: '/signup',
			isAuth: false,
			errorMsg: error.array()[0].msg,
			oldData: { email: email, password: password },
			validationErrors: error.array(),
		});
	}

	bcrypt
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
			res.redirect('/login');
			return transporter.sendMail({
				to: email,
				from: '"Node App"shop@node-complete.com',
				subject: 'Signup success',
				html: '<h1>Sign up success</h1>',
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getReset = (req, res, next) => {
	let msg = req.flash('error');
	msg = msg.length > 0 ? msg[0] : null;
	res.render('auth/reset', {
		pageTitle: 'Reset Password',
		path: '/reset',
		errorMsg: msg,
	});
};

exports.postReset = (req, res, next) => {
	const email = req.body.email;
	crypto.randomBytes(32, (err, buff) => {
		if (err) {
			console.log(err);
		}
		const token = buff.toString('hex');
		User.findOne({ email: email })
			.then((user) => {
				if (!user) {
					req.flash(
						'error',
						'No account found for the provided email'
					);
					return res.redirect('/reset');
				}
				user.resetToken = token;
				user.tokenExp = Date.now() + 3600000;
				return user.save();
			})
			.then((result) => {
				transporter.sendMail({
					to: email,
					from: '"Node App"shop@node-complete.com',
					subject: 'Pasword Reset',
					html: `
                    <p>Click the 
                        <a href="http://localhost:3000/reset/${token}">link</a> 
                        to reset the password
                        </p>`,
				});
				return res.redirect('/login');
			})
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	});
};

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({ resetToken: token, tokenExp: { $gt: Date.now() } })
		.then((user) => {
			let msg = req.flash('error');
			msg = msg.length > 0 ? msg[0] : null;
			res.render('auth/newPassword', {
				pageTitle: 'New Password',
				path: '/new-password',
				errorMsg: msg,
				userId: user._id.toString(),
				passwordToken: token,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postNewPassword = (req, res, next) => {
	const userId = req.body.userId;
	const password = req.body.password;
	const passwordToken = req.body.passwordToken;

	let resetUser;
	User.findOne({
		_id: userId,
		resetToken: passwordToken,
		tokenExp: { $gt: Date.now() },
	})
		.then((user) => {
			resetUser = user;
			return bcrypt.hash(password, 12);
		})
		.then((hashPassword) => {
			resetUser.password = hashPassword;
			resetUser.resetToken = undefined;
			resetUser.tokenExp = undefined;
			return resetUser.save();
		})
		.then((result) => {
			res.redirect('/login');
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};
