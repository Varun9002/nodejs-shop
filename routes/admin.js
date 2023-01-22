const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProducts);
router.post('/add-product', isAuth, adminController.postAddProducts);

router.get('/products', isAuth, adminController.getProducts);

router.post('/edit-product', isAuth, adminController.postEditProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProducts);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
