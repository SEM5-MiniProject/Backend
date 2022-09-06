const mongoose = require("mongoose");

const sellerSessionSchema = new mongoose.Schema({
    sellerId: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"seller"
    },
    valid: {
        type:Boolean,
        default:true
    },
    userAgent: {
        type:String,
        required:true
    },
}, { timestamps: true });

const sellerSession = mongoose.model("sellerSession", sellerSessionSchema);
module.exports = sellerSession;