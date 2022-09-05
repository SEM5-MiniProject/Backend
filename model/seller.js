const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require('mongoose-unique-validator');
const SellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name1"],
        maxlength: [30, "Name cannot exceed 30 character"],
        minlength: [3, "Name cannot be less than 3 character"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please enter email for name1"],
        trim: true,
        validate: [validator.isEmail, "Please enter valid email"],
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        minlength: [6, "Password cannot be less than 6 character"],
        select: false,
    },
    phoneNo: {
        type: Number,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
        },
    },
    address: {
        houseNo: {
            type: String,
            required: true,
            trim: true,
        },
        sector: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        pincode: {
            type: Number,
            required: true,
            trim: true,
        }
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    proof:{
        type: String,
        trim: true,
    }
}, { timestamps: true });
SellerSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
const Seller = mongoose.model("seller", SellerSchema);
Seller.createIndexes();
module.exports = Seller;