const mongoose = require("mongoose");

const UserSessionSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
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

const UserSession = mongoose.model("userSession", UserSessionSchema);
module.exports = UserSession;