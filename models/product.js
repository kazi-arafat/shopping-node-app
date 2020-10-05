const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const Cart = require('./cart');

const filePath = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (callback) => {
  // Function will help get data from file-system
  fs.readFile(filePath, (err, fileContent) => {
    if (!err) {
      return callback(JSON.parse(fileContent));
    } else {
      return callback([]);
    }
  });
};

class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  // for saving data
  save() {
    console.log("output DB file", filePath);
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex((p) => p.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        // console.log('updated product',updatedProducts[existingProductIndex]);
        fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
          console.log("Error during file save", err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(filePath, JSON.stringify(products), (err) => {
          console.log("Error during file save", err);
        });
      }
    });
  }
  
  // All Static methods

  // fetch all the data
  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  // fetch single product by Id
  static fetchProductById(id, callback) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      console.log(product);
      callback(product);
    });
  }

  // Delete Product
  static deleteProductById(id){
    getProductsFromFile(products =>{
      const allProducts = [...products];
      const product = products.find(p => p.id === id);
      const updatedProducts = allProducts.filter(prod => prod.id != id);
      fs.writeFile(filePath,JSON.stringify(updatedProducts),err =>{
        if(!err){
          // Delete the the item from Cart also
          console.log('Deleting Cart item');
          Cart.deleteProduct(id,product.price);
        }        
      });
    })
  }
}

module.exports = Product;