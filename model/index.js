const  User= require('./user')
const Food = require('./food')
const Order = require('./order')  
const Rating = require('./rating')
const Seller = require('./seller')

module.exports = {
    model : [
        User,
        Food,
        Order,
        Rating,
        Seller,
]
}
