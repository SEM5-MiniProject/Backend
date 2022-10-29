const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const RatingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, 'Please enter rating'],
    trim: true,
  },
  comment: {
    type: String,
    required: [true, 'Please enter comment'],
    trim: true,
  },
  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Please enter belongsTo'],
    trim: true,
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'food',
    required: [true, 'Please enter foodId'],
    trim: true,
  },
}, { timestamps: true });
RatingSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
const Rating = mongoose.model('rating', RatingSchema);
Rating.createIndexes();
module.exports = Rating;
