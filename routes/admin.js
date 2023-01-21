const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', adminController.getAddProducts);
router.post('/add-product', adminController.postAddProducts);

router.get('/products', adminController.getProducts);

router.post('/edit-product', adminController.postEditProduct);
router.get('/edit-product/:productId', adminController.getEditProducts);
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
