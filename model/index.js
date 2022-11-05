const User = require('./user');
const Food = require('./food');
const Order = require('./order');
const Rating = require('./rating');
const Seller = require('./seller');
const Offer = require('./offer');
const Cart = require('./cart');
module.exports = {
  model: [
    User,
    Food,
    Order,
    Rating,
    Seller,
    Offer,
    Cart,
  ],
};
