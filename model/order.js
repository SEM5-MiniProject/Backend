const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require('mongoose-unique-validator');
const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Please enter userId"],
        trim: true,
    },
    orderDetails: {
        type: [{
            foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "food",
                required: [true, "Please enter foodId"],
                trim: true,
            },
            quantity: {
                type: Number,
                required: [true, "Please enter quantity"],
                trim: true,
            }
        }],
        required: [true, "Please enter orderDetails"],
    },
    totalAmount: {
        type: Number,
        required: [true, "Please enter totalAmount"],
        trim: true,
    },
    paymentType: {
        type: String,
        required: [true, "Please enter paymentType"],
        trim: true,
    },
    paymentStatus: {
        type: String,
        required: [true, "Please enter paymentStatus"],
        trim: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Please enter sellerId"],
        trim: true,
    },
    orderStatus: {
        type: String,
        required: [true, "Please enter orderStatus"],
        enum: ["pending", "accepted", "delivered", "cancelled"],
        default: "pending",
        trim: true,
    },
},{ timestamps: true });


OrderSchema.pre('save',async function (this){
    let totalAmount = 0;
    this.orderDetails.forEach(async (orderDetail) => {
        const price = await Food.findById(orderDetail.foodId).select("price");
        // totalAmount += orderDetail.quantity * orderDetail.foodId.price;
        totalAmount += orderDetail.quantity * price;
    })
    this.totalAmount = totalAmount;
    return next();
})
OrderSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
const Order = mongoose.model("order", OrderSchema);
Order.createIndexes();
module.exports = Order;