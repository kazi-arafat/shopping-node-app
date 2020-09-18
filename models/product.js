const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const filePath = path.join(rootDir,'data','products.json');

const getProductsFromFile = (callback) => {
    // Function will help get data from file-system
    fs.readFile(filePath,(err,fileContent) => {
        if(!err){
            return callback(JSON.parse(fileContent));
        }
        else{
            return callback([]);
        }
    });
}

class Product {
    constructor(title,imageUrl,description,price){
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    // for saving data
    save(){
        this.id = Math.random().toString();
        console.log('output DB file',filePath);
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), err =>{
                console.log('Error during file save',err);
            });
        });
    }
    // fetch all the data
    static fetchAll(callback){
        getProductsFromFile(callback);
    }

    // fetch single product by Id
    static fetchProductById(id,callback){
        getProductsFromFile(products =>{
            const product = products.find(p => p.id === id);
            callback(product);
        });
        
    }
}

module.exports =  Product;