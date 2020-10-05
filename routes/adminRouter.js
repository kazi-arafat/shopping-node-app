const path = require("path");

const express = require("express");

const adminController = require("../controllers/adminController");

const router = express.Router();

// route url /admin/add-product  => GET
router.get("/add-product", adminController.getAddProduct);

// route url /admin/products => GET
router.get("/products", adminController.getAllAdminProducts);

// route url admin/edit-product/id => GET
router.get("/edit-product/:productId", adminController.getEditProduct);

// route url /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

// route url admin/edit-product => POST
router.post("/edit-product", adminController.postEditProduct);

// route url admin/delete-product => POST
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
