const mongoose = require('mongoose');

module.exports = mongoose.model('Review', {
    productId:{type:String, required:[true, "productid is needed "]},
    subject:{type: String, required:[true, "subject is needed "]},
    message:String,
    rating:Number,
    lastUpdated:{type: Date, default: Date.now}
})