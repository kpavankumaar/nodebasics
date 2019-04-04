var express = require('express');
var app = express();

var productCtrl = require('./controllers/product.ctrl');
var defaultRouter = require('./routes/default.router');
var productRouter = require('./routes/product.router');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const middlewares = require('./middleware')


mongoose.connect('mongodb://localhost:27017/nbits-products',()=>{
    console.log('mongodb');
});


app.use(bodyParser.json());
app.use('/',defaultRouter);
// api prefix is a convention and for few websites may have subdomains as api.github.com/users 
// *************** move the following code to middleware.js
// middleware

// function authenticate(req,res,next){
//     console.log(req.headers);
//     let base64String = req.headers["authorization"].replace("Basic ","");
//     let decodedString = new Buffer(base64String, 'base64').toString();

//     let tokens = decodedString.split(":");

//     let username = tokens[0];
//     let password = tokens[1];
//     if (username == 'admin' && password == 'password'){
//         next();    
//     }else{
//         res.status(401);
//         res.send('unauthorized')
//     }
    
//     // next();// means go ahead and it is a function 
// }

// registration of middleware
app.use(middlewares.authenticate);
// private 
app.use('/api/products',productRouter);

app.listen(3000,function(){
    console.log('we are listening to port', 3000 );
})
