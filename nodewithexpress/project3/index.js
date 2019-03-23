var express = require('express');
var app = express();
var productCtrl = require('./controllers/product.ctrl');
var defaultRouter = require('./routes/default.router');
var productRouter = require('./routes/product.router');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/',defaultRouter);
// api prefix is a convention and for few websites may have subdomains as api.github.com/users 
app.use('/api/products',productRouter);

app.listen(3000,function(){
    console.log('we are listening to port', 3000 );
})