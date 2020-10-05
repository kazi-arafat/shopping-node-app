const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const cartFilePath = path.join(rootDir,'data','cart.json');

class Cart {
    //Ideally there should be always one cart and each time it will either add new product or update the quantity of the product

    static addProduct(id, productPrice){
        // fetch old cart
        fs.readFile(cartFilePath, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if(!err){
                cart = JSON.parse(fileContent);
                console.log('Already items in cart',cart);
            }
            // analyze the cart => find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            // Add new product or increase existing quantity
            let updatedProduct;
            if(existingProduct){
                // Increase qty and update cart
                // updatedProduct = { ...existingProduct }; //javascript object spread next gen feature
                updatedProduct = existingProduct;
                updatedProduct.qty = existingProduct.qty + 1;
                console.log('Updated Product during cart add',updatedProduct);
                // cart.products = [ ...cart.products ];
                cart.products[existingProductIndex] = updatedProduct;
            }
            else{
                // add new item and update cart with new item
                updatedProduct = { id: id, qty: 1};
                cart.products = [ ...cart.products, updatedProduct];
                console.log('new item added in cart.');
            }
            // set price
            cart.totalPrice = cart.totalPrice + +productPrice;
            console.log('Writing cart data at data file',cart);
            fs.writeFile(cartFilePath, JSON.stringify(cart), err => console.log(err,'during cart data writing'));
        });
    }

    static deleteProduct(id,productPrice){
        fs.readFile(cartFilePath,(err,fileContent) => {
            if(err){
                console.log('Error while reading cart datafile',err);
                return
            }
            const updatedCart = { ...JSON.parse(fileContent)};
            const product = updatedCart.products.find(prod => prod.id == id);
            if(!product){
                console.log('Product is not in cart');
                return
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            // console.log(productQty * productPrice);
            updatedCart.totalPrice = updatedCart.totalPrice - productQty * productPrice;

            fs.writeFile(cartFilePath,JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    }

    static getCart(cb){
        fs.readFile(cartFilePath,(err,fileContent) => {
            if(err){
                cb(null);
            }
            else{
                const cart = JSON.parse(fileContent);
                cb(cart);
            }
        });
    }
}
module.exports = Cart;