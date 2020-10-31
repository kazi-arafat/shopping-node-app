const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class Product {
  constructor(title, imageUrl, description, price,id,userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection('products')
        .updateOne({_id: this._id},{$set:this});
    } else {
      dbOp = db.collection('products')
      .insertOne(this);
    }
    return dbOp
      .then(result =>{
        console.log('Save executed',result);
      })
      .catch(err => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray()
      .then(products =>{
        return products;
      })
      .catch(err => console.log(err));
  }

  static fetchById(productId){
    const db = getDb();
    return db.collection('products')
      .find({_id: new mongodb.ObjectId(productId)})
      .next()
      .then(product => {
        // console.log(product);
        return product;
      })
      .catch(err => console.log(err));
  }

  static delete(productId){
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id : new mongodb.ObjectId(productId) })
      .then(deleteResult =>{
        console.log(`${deleteResult.deletedCount} records deleted successfully from database.`);
        return deleteResult;
      })
      .catch(err => console.log(err))
  }
} 

module.exports = Product;