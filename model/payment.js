const mongoose = require('mongoose')

const paymentDetailsSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },    
    amount: {
        type: Number
    },
    receiptId: {
        type: String
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

module.exports = mongoose.model('PaymentDetail', paymentDetailsSchema)