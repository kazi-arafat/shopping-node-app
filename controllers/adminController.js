const Product = require("../models/product");

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
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getAllAdminProducts = (req, res, next) => {
  console.log("Get all products admin");
  Product.fetchAll((products) => {
    res.render("admin/products.pug", {
      prods: products,
      pageTitle: "Admin all Poducts",
      path: "/admin/products",
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  console.log(req.params.productId);
  const id = req.params.productId;
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  Product.fetchProductById(id, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product.pug", {
      pageTitle: "Edit Product",
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const updatedProduct = new Product(
    productId,
    updatedTitle,
    updatedImageUrl,
    updatedDescription,
    updatedPrice
  );
  // console.log(updatedProduct);
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.id;
  Product.delete(productId);
  res.redirect('/admin/products');
};
