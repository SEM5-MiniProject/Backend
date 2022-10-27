const mongoose = require ("mongoose");

const CartSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    food_id:{
        type: Number
    }
});

module.exports = mongoose.model("Cart", CartSchema);