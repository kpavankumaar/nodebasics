

const mongoose = require('mongoose');

function priceValidator(value){
    return value >= 100
    // return /^[0-9]{3}/.test(value); here we are testing weather we have value is number and it is 3 digit number
}
module.exports = mongoose.model('Product',{
    // brand:{type:String, required: [true, 'brand is required' ], minlength: 3, maxlength: 10 },
    brand: { type: String, required: [true, 'brand is required'] },
    model: { type: String, required: [true, 'model is mandatory' ] },
    price: { type: Number, validate:{ validator: priceValidator }},
    inStock: { type: Boolean, default:false },
    lastUpdated: { type: Date, default: Date.now}
});


