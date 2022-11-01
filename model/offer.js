const mongoose = require('mongoose');
const log = require('../log');
const Schema = mongoose.Schema;
const Food = require('./food');
const OfferSchema = new Schema({
  food: {
    type: Schema.Types.ObjectId,
    ref: 'food',
    required: true,
    unique: true,
  },
  validTill: {
    type: Date,
    required: true,
  },
  newprice: {
    type: Number,
  },
  discount: {
    type: Number,
    required: true,
  }
},{
  timestamps: true,
});

// calculate new price
OfferSchema.pre('save', function (next) {
  Food.findById(this.food, (err, food) => {
    if (err) {
      log.error(err);
      return next(err);
    }
    if (food) {
      this.newprice = food.price - (food.price * this.discount / 100);
      return next();
    }
    return next(new Error('Food not found'));
  });
});

// findOneAndUpdate middleware
OfferSchema.pre('findOneAndUpdate', function (next) {
  log.info(this.getQuery());
  const { validTill, discount } = this.getUpdate();
  if (validTill || discount) {
    Food.findById(this.getQuery().food, (err, food) => {
      if (err) {
        log.error(err);
        return next(err);
      }
      if (food) {
        const newprice = food.price - (food.price * discount / 100);
        this.set({ newprice });
        return next();
      }
      return next(new Error('Food not found'));
    });
  } else {
    return next();
  }
});
const offer = mongoose.model('offer', OfferSchema);
module.exports = offer;
