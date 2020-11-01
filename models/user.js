const mongoose = require('mongoose');

const userShcema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [{
      productId: {type: mongoose.Types.ObjectId, ref: 'Product', required: true},
      quantity: {type: Number, required: true}
    }]
  }
});

userShcema.methods.addToCart = function(product){
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [ ...this.cart.items];

  if(cartProductIndex > -1){
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  }else{
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  return this.save();
};

userShcema.methods.deleteItemFromCart = function(productId){
  const updatedCartItems = this.cart.items.filter(product =>{
    return product.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems
  return this.save();
}

userShcema.methods.addOrder = function(){
  this
    .populate()
    .execPopulate()
    .then()
}

// userShcema.methods.clearCart = function(productId){
//   this
//     .populate()
//     .execPopulate()
//     .then()
// }
module.exports = mongoose.model('User',userShcema);