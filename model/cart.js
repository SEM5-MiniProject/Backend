const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cartSchema = new Schema({
  food: {
    type: Schema.Types.ObjectId,
    ref: 'food',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  quantity: {
    type: Number,
    default: 1,
  },
});
// pre save hook to check if the quantity is less than 1
cartSchema.pre('save', function (next) {
  if (this.quantity===undefined ||this.quantity < 1) {
    this.quantity = 1;
  }
  next();
});
module.exports = mongoose.model('Cart', cartSchema);