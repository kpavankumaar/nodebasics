var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var productCtrl = require('./controllers/product.ctrl');
const defaultRouter = require('./routes/default.router');
const productRouter = require('./routes/product.router');
const userRouter = require('./routes/user.router');
const reviewRouter = require('./routes/review.router');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const middlewares = require('./middleware')


mongoose.connect('mongodb://localhost:27017/nbits-products',()=>{
    console.log('mongodb');
});


app.use(bodyParser.json());
app.use('/',defaultRouter);

// middleware



// app.use(middlewares.tokenAuth);


app.use('/api/users', userRouter);
// basic auth
// app.use(middlewares.authenticate);
// private 
app.use('/api/products',productRouter);
app.use('/api/reviews',reviewRouter)

app.listen(3000,function(){
    console.log('we are listening to port', 3000 );
})
