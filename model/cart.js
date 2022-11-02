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
module.exports = mongoose.model('Cart', cartSchema);