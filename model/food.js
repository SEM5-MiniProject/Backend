const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter name'],
    maxlength: [30, 'Name cannot exceed 30 character'],
    minlength: [3, 'Name cannot be less than 3 character'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please enter price'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please enter description'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Please enter image'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please enter category'],
    enum: ['launch', 'dinner', 'breakfast', 'snacks'],
    trim: true,
  },
  isVeg: {
    type: Boolean,
    required: [true, 'Please enter isVeg'],
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    required: [true, 'Please enter isAvailable'],
    trim: true,
  },
  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'seller',
    required: [true, 'Please enter belongsTo'],
    trim: true,
  },
}, { timestamps: true });

FoodSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
const Food = mongoose.model('food', FoodSchema);
Food.createIndexes();
module.exports = Food;
