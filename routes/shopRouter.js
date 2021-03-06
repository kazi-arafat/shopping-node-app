const path = require('path');

const express = require('express');

const shopController = require('../controllers/shopController');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/product-list', shopController.getProducts);
router.get('/products/:productID',shopController.getProduct);
router.get('/cart', shopController.getCart);
router.post('/add-to-cart', shopController.postCart);
router.post('/delete-cart', shopController.postDeleteCart);
router.get('/orders', shopController.getOrders);
router.get('/checkout', shopController.getCheckout);
router.post('/create-order',shopController.postOrder)

module.exports = router;