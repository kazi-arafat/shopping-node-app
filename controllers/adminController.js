const Product = require("../models/product");
const User = require("../models/user");

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir,'views','add-product.html'));
  res.render("admin/edit-product.pug", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  // console.log(req.body.title);
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, description, price, null, req.user._id);
  product
    .save()
    .then((result) => {
      console.log("Product created!");
      res.redirect("/admin/products");
    })
    .catch((error) => console.error(error));
};

exports.getAllAdminProducts = (req, res, next) => {
  console.log("Get all products admin");
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products.pug", {
        prods: products,
        pageTitle: "Admin all Poducts",
        path: "/admin/products",
      });
    })
    .catch((error) => console.error(error));
};

exports.getEditProduct = (req, res, next) => {
  console.log(req.params.productId);
  const id = req.params.productId;
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  Product.fetchById(id)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product.pug", {
        pageTitle: "Edit Product",
        editing: editMode,
        product: product,
      });
    })
    .catch((error) => console.error(error));
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const userId = req.user._id;
  const updatedProduct = new Product(
    updatedTitle,
    updatedImageUrl,
    updatedDescription,
    updatedPrice,
    productId,
    userId
  );
  // console.log(updatedProduct);
  updatedProduct
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => console.error(error));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.id;
  Product.delete(productId)
    .then(() => {
      User.clearCart(productId)
    })
    .then(() =>{
      res.redirect("/admin/products");
    })
    .catch((err) => console.error(err));
};

