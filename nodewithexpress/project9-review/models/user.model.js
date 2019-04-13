const mongoose = require("mongoose");

const UserModel = mongoose.model("User",{
    userName : {type:String, unique: true, required:[true, "username is required"]},
    password: { type: String, required: [true, "password is required"] },
    active: {type:Boolean , default:true}, // instead of deleting the user we can keep the acc deactivated 
    lastUpdated:{type: Date , default: Date.now}, // we want to keep track when this info is updated
})

module.exports = UserModel;

