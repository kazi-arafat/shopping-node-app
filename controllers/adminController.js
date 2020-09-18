const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('admin/add-product.pug',{pageTitle : 'Add product', path : '/admin/add-product'});
};

exports.postAddProduct = (req, res, next) => {
    // console.log(req.body.title);
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title,imageUrl,description,price);
    product.save();
    res.redirect('/');
};

exports.getAllAdminProducts = (req, res, next) => {
    console.log('Get all products admin');
    Product.fetchAll(products => {
        res.render('admin/products.pug',{prods: products, pageTitle: 'Admin all Poducts', path : '/admin/products'});
    });
    
}