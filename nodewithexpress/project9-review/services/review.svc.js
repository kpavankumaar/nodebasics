const Review = require('../models/review.model');

class ReviewService {
    get(id) {
        return Review.find({ productId: id }, { _id: 0, __v: 0 })
            .exec()
    }
}

module.exports = new ReviewService();
