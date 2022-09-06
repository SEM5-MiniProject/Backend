const  User= require('./user')
const Food = require('./food')
const Order = require('./order')  
const Rating = require('./rating')
const Seller = require('./seller')
const UserSession = require('./session/user')
const SellerSession = require('./session/seller')

module.exports = {
    model : [
        User,
        Food,
        Order,
        Rating,
        Seller,
        UserSession,
        SellerSession
]
}
