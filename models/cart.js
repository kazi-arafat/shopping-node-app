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
                // cart.products = [ ...cart.products ];
                cart.products[existingProductIndex] = updatedProduct;
            }
            else{
                // add new item and update cart with new item
                updatedProduct = { id: id, qty: 1};
                cart.products = [ ...cart.products, updatedProduct];
            }
            // set price
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(cartFilePath, JSON.stringify(cart), err => console.log(err,'from cart data writing'));
        });
    }
}

module.exports = Cart;