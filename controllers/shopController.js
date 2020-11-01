const Product = require("../models/product");
const User = require('../models/user');
const Order = require("../models/order");


exports.getProducts = (req, res, next) => {
  // console.log('In another middleware!');
  Product.find()
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
  Product.findById(pdctId)
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
  Product.find()
    .then((products) => {
      res.render("shop/index.pug", { prods: products, pageTitle: "The Shop" });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user =>{
      const cartProducts = user.cart.items;
      // console.log('Cart Products',cartProducts);
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
  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.error(err));
};

exports.getOrders = (req, res, next) => {
  Order
    .find({'user._id': req.user._id})
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
    .populate('cart.items.productId')
    .execPopulate()
    .then(user =>{
      // console.log('user',user);
      const products = user.cart.items.map(item =>{
        return {
          quantity: item.quantity,
          price: item.productId.price,
          _id: item.productId._id,
          title: item.productId.title,
          imageUrl: item.productId.imageUrl,
          description: item.productId.description
        }
      })
      const order = new Order({
        products: products,
        user: {
          name: req.user.name,
          _id: req.user._id
        }
      });
      // console.log('Order Obj',order)
      return order.save();
    })
    .then(() =>{
      req.user.cart.items = [];
      return req.user.save()
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
}