const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProducts);
router.post(
	'/add-product',
	[
		body('title')
			.isString()
			.withMessage('Title must contain Alphabets and numbers only')
			.isLength({ min: 3 })
			.withMessage('Title must contain atleast 3 characters')
			.trim(),
		body('price', 'Price can only be number').isFloat(),
		body('description').isLength({ min: 10 }).trim(),
	],
	isAuth,
	adminController.postAddProducts
);

router.get('/products', isAuth, adminController.getProducts);

router.post(
	'/edit-product',
	[
		body('title')
			.isString()
			.withMessage('Title must contain Alphabets and numbers only')
			.isLength({ min: 3 })
			.withMessage('Title must contain atleast 3 characters')
			.trim(),
		body('price', 'price can only be number').isFloat(),
		body('description').isLength({ min: 10 }).trim(),
	],
	isAuth,
	adminController.postEditProduct
);
router.get('/edit-product/:productId', isAuth, adminController.getEditProducts);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
