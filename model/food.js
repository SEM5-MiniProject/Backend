const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const log = require('../log');

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
    default: false,
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    required: [true, 'Please enter isAvailable'],
    default:false,
    trim: true,
  },
  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'seller',
    required: [true, 'Please enter belongsTo'],
    trim: true,
  },
}, { timestamps: true });

// check if for same seller, food name and image is unique
FoodSchema.pre('save', async function (next) {
  const food = this;
  console.log("Food pre is called", food);

  const res = await Food.findOne({
    $and: [
      { name: food.name },
      { belongsTo: food.belongsTo },
    ],
  });
  if (res) {
    log.error('Food already exists');
    throw new Error('Food already exists');
  }
  next();
});

FoodSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
const Food = mongoose.model('food', FoodSchema);
module.exports = Food;
