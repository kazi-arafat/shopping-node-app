const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  // console.log('In another middleware!');
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list.pug", {
        prods: products,
        pageTitle: "All Products",
        path: "/product-list",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const pdctId = req.params.productID;
  Product.fetchById(pdctId)
    .then((product) => {
      res.render("shop/product-detail.pug", {
        pageTitle: product.title,
        prod: product,
        path: "/product-list",
      });
    })
    .catch((error) => console.error(error));
};

exports.getIndex = (req, res, next) => {
  // console.log('Index file');
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index.pug", { prods: products, pageTitle: "The Shop" });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cartProducts =>{
      res.render("shop/cart.pug", {
          path: "/cart",
          pageTitle: "Your Cart",
          products: cartProducts,
        });
    })
    .catch(err => console.log(err));   
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  // console.log('Product id',productId);
  Product.fetchById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      // console.log(result);
      res.redirect('/cart')
    })
    .catch(err => console.error(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders =>{
      console.log('Orders',orders);
      res.render("shop/orders.pug", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders
      });
    })
    .catch(err => console.log(err));  
};

exports.getCheckout = (req, res, next) => {
  // console.log('Index file');
  Product.fetchAll((products) => {
    res.render("shop/cart.pug", { path: "/checkout", pageTitle: "Checkout" });
  });
};

exports.postDeleteCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .deleteItemFromCart(productId)
    .then(() =>{
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
}