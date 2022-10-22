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

// check if for same seller, food name and image is unique
FoodSchema.pre('save',function (next) {
  const food = this;
  food.constructor.findOne({ name: food.name, image: food.image, belongsTo: food.belongsTo }, (err, foundFood) => {
    if (err) {
      next(err);
      } else if (foundFood) {
        next(new Error('Food already exists'));
      } else {
        next();
      }
  });
});

FoodSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
const Food = mongoose.model('food', FoodSchema);
Food.createIndexes();
module.exports = Food;
