const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Please enter userId'],
    trim: true,
  },
  orderDetails: {
    type: [{
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food',
        required: [true, 'Please enter foodId'],
        trim: true,
      },
      quantity: {
        type: Number,
        default: 1,
        required: [true, 'Please enter quantity'],
        trim: true,
      },
      price: {
        type: Number,
      },
    }],
    required: [true, 'Please enter orderDetails'],
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please enter totalAmount'],
    trim: true,
  },
  paymentType: {
    type: String,
    required: [true, 'Please enter paymentType'],
    trim: true,
  },
  orderId:{
    type: String,
    required: [true, 'Please enter orderId'],
    trim: true,
  },
  receiptId:{
    type: String,
    required: [true, 'Please enter receiptId'],
    trim: true,
  },
  paymentId:{
    type: String,
    trim: true,
  },
  signature:{
    type: String,
    trim: true,
  },
  paymentStatus: {
    type: String,
    trim: true,
  },
  orderStatus: {
    type: String,
    required: [true, 'Please enter orderStatus'],
    enum: ['pending', 'accepted', 'delivered', 'cancelled'],
    default: 'pending',
    trim: true,
  },
}, { timestamps: true });

// OrderSchema.pre('save',async function (){
//     let totalAmount = 0;
//     this.orderDetails.forEach(async (orderDetail) => {
//         const price = await Food.findById(orderDetail.foodId).select("price");
//         // totalAmount += orderDetail.quantity * orderDetail.foodId.price;
//         totalAmount += orderDetail.quantity * price;
//     })
//     this.totalAmount = totalAmount;
//     return next();
// })
// Calulate the price and total amount of the order
// OrderSchema.pre('save', async function (next) {
//   let totalAmount = 0;
//   for (let i = 0; i < this.orderDetails.length; i++) {
//     const food = await Food.findById(this.orderDetails[i].foodId);
//     this.orderDetails[i].price = food.price;
//     const offer = await Offer.findOne({ food: this.orderDetails[i].foodId });
//     if (offer && offer.validTill > Date.now()) {
//       this.orderDetails[i].price = offer.newprice;
//     }
//     totalAmount += this.orderDetails[i].quantity * food.price;
//   }
//   this.totalAmount = totalAmount;
//   return next();
// });
OrderSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
const Order = mongoose.model('order', OrderSchema);
Order.createIndexes();
module.exports = Order;
