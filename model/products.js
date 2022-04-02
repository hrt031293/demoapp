const mongoose = require('mongoose');
var productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false
    },
    display: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date, 
        default: Date.now
    },
    updatedAt: {
        type: Date
    }

 });

var product = mongoose.model('product', productSchema);
module.exports = product;