const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require('mongoose-unique-validator');
const UserSchema = new mongoose.Schema({
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
    role: {
        type: String,
        enum: ["user", "seller", "admin"],
        default: "user",
    },
}, { timestamps: true });
UserSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
const User = mongoose.model("user", UserSchema);
User.createIndexes();
module.exports = User;