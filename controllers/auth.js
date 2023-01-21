const User = require('../models/User');

exports.getLogin = (req, res, next) => {
	res.render(
		'auth/login',

		{
			pageTitle: 'Login',
			path: '/login',
			isAuth: false,
		}
	);
};

exports.postLogin = (req, res, next) => {
	User.findById('63bec7263b046f2911b75cf3')
		.then((user) => {
			req.session.user = user;
			req.session.isLoggedIn = true;
			req.session.save((err) => {
				console.log(err);
				res.redirect('/');
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
