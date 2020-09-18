const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    console.log('In another middleware!');
    Product.fetchAll( products => {
        res.render('shop/product-list.pug', {prods : products, pageTitle : 'All Products', path: '/product-list'});
    });
}

exports.getProduct = (req, res, next) => {
    const pdctId = req.params.productID;
    Product.fetchProductById(pdctId,product =>{
        console.log(product);
        res.render('shop/product-detail.pug',{ pageTitle: product.title, prod: product, path:'/product-list'});
    });
    
}

exports.getIndex = (req, res, next) => {
    console.log('Index file');
    Product.fetchAll( products => {
        res.render('shop/index.pug', {prods : products, pageTitle : 'The Shop'});
    });
}

exports.getCart = (req, res, next) => {
    // console.log('Index file');
    Product.fetchAll( products => {
        res.render('shop/cart.pug', {path : '/cart', pageTitle : 'Your Cart'});
    });
}

exports.postCart = (req, res, next) => {
    // console.log('Index file');
    const productId = req.body.productId;
    // console.log(productId,'Post Cart');
    Product.fetchProductById(productId, product =>{
        Cart.addProduct(productId,product.price);
    })
    res.redirect('/');
    // Product.fetchAll( products => {
    //     res.render('shop/cart.pug', {path : '/cart', pageTitle : 'Your Cart'});
    // });
}

exports.getOrders = (req, res, next) => {
    // console.log('Index file');
    Product.fetchAll( products => {
        res.render('shop/orders.pug', {path : '/orders', pageTitle : 'Your Orders'});
    });
}

exports.getCheckout = (req, res, next) => {
    // console.log('Index file');
    Product.fetchAll( products => {
        res.render('shop/cart.pug', {path : '/checkout', pageTitle : 'Checkout'});
    });
}

