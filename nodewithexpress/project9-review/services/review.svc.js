const Review = require('../models/review.model');

class ReviewService{
    get(){
        return Review.find({ product:id},{_id:0, __v:0})
        .exec()
    }
}

module.exports = new ReviewService();