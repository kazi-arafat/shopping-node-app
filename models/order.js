const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: {
        type: [{ 
            _id: {type: mongoose.Types.ObjectId, ref:'Product',required: true},
            title: {type: String, required: true},
            imageUrl: {type: String, required: true},
            description: {type: String, required: true},
            price: {type: Number, required: true},
            quantity: {type: Number, required: true},
        }],
        required: true
    },
    user: {
        _id: {type: mongoose.Types.ObjectId, ref:'User',required: true},
        name: {type: String, required: true}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Order', orderSchema);