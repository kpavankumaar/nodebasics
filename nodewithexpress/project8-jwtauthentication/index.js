var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var productCtrl = require('./controllers/product.ctrl');
var defaultRouter = require('./routes/default.router');
var productRouter = require('./routes/product.router');
var userRouter = require('./routes/user.router');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const middlewares = require('./middleware')


mongoose.connect('mongodb://localhost:27017/nbits-products',()=>{
    console.log('mongodb');
});


app.use(bodyParser.json());
app.use('/',defaultRouter);

// middleware



app.use(middlewares.tokenAuth);
app.use('/api/users', userRouter);
// basic auth
// app.use(middlewares.authenticate);
// private 
app.use('/api/products',productRouter);

app.listen(3000,function(){
    console.log('we are listening to port', 3000 );
})
