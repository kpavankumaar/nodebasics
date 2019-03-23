var express = require('express');
var router = express.Router();

// middlewear that is specific to this router
router.use(function(req,res,next){
    console.log('Time',Date.now());
    next()
})

// define home page route
router.get('/',function(req,res){
    res.send('birds from the home page');
})

router.get('/about',function(req,res){
    res.send('About Birds');
})

module.exports = router;