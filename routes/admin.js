const path = require('path');

const express = require('express');

const adminController = require('../controllers/adminController');


const router = express.Router();


// route url /admin/add-product  => GET
router.get('/add-product',adminController.getAddProduct);

router.get('/products', adminController.getAllAdminProducts);

// route url /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

// route url /admin/products => GET


module.exports = router;