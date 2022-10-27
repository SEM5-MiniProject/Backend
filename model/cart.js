const mongoose = require ("mongoose");

const CartSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId, ref:'user',
        required:true
    },
    food_id:{
        type:mongoose.Schema.Types.ObjectId, ref:'user',
        required:true
    },
    quantity:{
        type:mongoose.Schema.Types.Number, ref:'user',
        required:true
    }
});

module.exports = mongoose.model("Cart", CartSchema);