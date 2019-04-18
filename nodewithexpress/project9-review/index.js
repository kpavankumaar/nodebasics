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
const config = require('./config')

const PORT = process.env.PORT || 3000;

  
mongoose.connect(config.conStr, {dbName:'nbitsdb'},(err)=>{
    console.log('error ', err);
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

app.listen(PORT,function(){
    console.log('we are listening to port', 3000 );
})
