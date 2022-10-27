const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const { hashPassword } = require('../utils/bcrypt.util');

const SellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter name'],
    maxlength: [30, 'Name cannot exceed 30 character'],
    minlength: [3, 'Name cannot be less than 3 character'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please enter email'],
    trim: true,
    unique: true,
    validate: [validator.isEmail, 'Please enter valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter password'],
    minlength: [6, 'Password cannot be less than 6 character'],
    select: false,
  },
  phoneNo: {
    type: Number,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: (v) => /\d{10}/.test(v),
    },
  },
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
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  proof: {
    type: String,
    trim: true,
  },
}, { timestamps: true });
SellerSchema.pre('save', async function (next)  {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await hashPassword(this.password);
  next();
});
SellerSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
const Seller = mongoose.model('seller', SellerSchema);
Seller.createIndexes();
module.exports = Seller;
