const mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    number: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    type: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        required: true.valueOf,
        default: false
    },
    createdAt: {
        type: Date, 
        default: Date.now
    },
    updatedAt: {
        type: Date
    }

 });

var user = mongoose.model('user', userSchema);
module.exports = user;