const express = require('express');
const authController = require('../controllers/auth');
const { check, body } = require('express-validator/check');
const User = require('../models/User');
const router = express.Router();

router.get('/login', authController.getLogin);
router.post(
	'/login',
	[
		check('email')
			.isEmail()
			.withMessage('Enter a valid Email')
			.normalizeEmail(),
		body(
			'password',
			'Enter password with only numbers and letters of minimum length 6'
		)
			.isLength({ min: 6 })
			.isAlphanumeric()
			.trim(),
	],
	authController.postLogin
);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post(
	'/signup',
	[
		check('email')
			.isEmail()
			.withMessage('Enter a valid Email')
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject(
							'E-mail already exists, please pick a different one'
						);
					}
				});
			})
			.normalizeEmail(),
		body(
			'password',
			'Enter password with only numbers and letters of minimum length 6'
		)
			.isLength({ min: 6 })
			.isAlphanumeric()
			.trim(),
		body('confirmPassword').custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("Passwords didn't match");
			}
			return true;
		}),
	],
	authController.postSignup
);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
