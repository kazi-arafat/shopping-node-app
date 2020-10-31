const mongodb = require("mongodb");
const Product = require("./product");

const getDb = require("../util/database").getDb;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log("User saved");
      })
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQty = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex > -1) {
      // Update the existing product qty
      newQty = updatedCartItems[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQty;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQty,
      });
    }
    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  deleteItemFromCart(productid){
    const updatedCartItems = this.cart.items.filter(item =>{
      return item.productId.toString() !== productid.toString();
    });
    const db = getDb();
    return db
      .collection('users')
      .updateOne({_id: new mongodb.ObjectId(this._id)},{$set: {cart: {items: updatedCartItems}}});
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((item) => {
      return item.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((prod) => {
          return {
            ...prod,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === prod._id.toString();
            }).quantity
          };
        });
      })
      .catch(err => console.log(err));
  }

  addOrder(){
    const db = getDb();
    return this.getCart()
      .then(products =>{
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.name
          }
        };
        return db.collection('orders')
        .insertOne(order)
      })
      .then(() =>{
        this.cart.items = [];
        return db
          .collection('users')
          .updateOne(
            {_id: new mongodb.ObjectId(this._id)},
            {$set: {cart: {items: []}}}
          );
      })
      .catch(err => console.log(err));
  }

  getOrders(){
    const db = getDb();
    // let userOrders;
    return db.collection('orders')
      .find({'user._id' : new mongodb.ObjectId(this._id)})
      .toArray()
      .then(orders => {
        // let orderedProduct;
        console.log('orders ',orders);
        return orders;
      })
  }

  static fetchById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .find({ _id: new mongodb.ObjectId(userId) })
      .next()
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }

  static clearCart(productId){
    const db = getDb();
    return db
      .collection('users')
      .find({'cart.items.productId': new mongodb.ObjectId(productId)})
      .next()
      .then(user =>{
        // const updatedUser = { ...user, cart: {items: []}}
        const filterCartItems = user.cart.items.filter(item =>{
          return item.productId.toString() !== productId.toString();
        })
        const updatedCart = { items: filterCartItems }
        return db
          .collection('users')
          .updateOne({_id: new mongodb.ObjectID(user._id)},{$set: {cart: updatedCart}})
      })
      .catch(err => console.log(err));
  }
}

module.exports = User;
