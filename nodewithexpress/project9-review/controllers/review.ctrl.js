const Review = require('../models/review.model')
// for this we have not given reiview service create that as an assignment
class ReviewCtrl{
    save(req, res){
        var review = new Review(req.body);

        review.save()
        .then(function(result){
            console.log(req.body);
            res.status(201);
            res.json(result);
        })
        .catch(function(err){
            res.status(400);
            res.send(err);
        })
    }
    
}   

module.exports = new ReviewCtrl();