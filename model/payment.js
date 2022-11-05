const mongoose = require('mongoose')
const Order = require('./order')
const paymentDetailsSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  receiptId: {
    type: String,
    required: true
  },
  paymentId: {
    type: String,
  },
  signature: {
    type: String,
  },
  email: {
    type: String
  },
  contact: {
    type: String
  },
  createdAt: {
    type: Date
  },
  status: {
    type: String
  }
});

// when we findOneAndUpdate, if the status is paid, then we need to create the order model
paymentDetailsSchema.post('findOneAndUpdate', async function (doc) {
  if (doc.status === 'paid') {
    const order = new Order({
      userId: doc.userId,
      orderDetails: [{
        foodId: doc.foodId,
        quantity: 1,
        price: doc.amount
      }],
      totalAmount: doc.amount,
      paymentType: 'razorpay',
      paymentStatus: 'paid'
    })
    await order.save()
  }
})

module.exports = mongoose.model('PaymentDetail', paymentDetailsSchema)