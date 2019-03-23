var app = require('express');
var productCtrl = require('./controllers/product.ctrl');
var defaultRouter = require('./routes/default.router');
var productRouter = require('./routes/product.router');
app.use('/',defaultRouter);
app.use('/',productRouter);

// app.get('/products', function(req,res){
//     var products = [
//         {id:1, brand:'nokia',model:'x6', price:250, inStock:true},
//         {id:2, brand: 'nokia', model: '6', price: 250, inStock: true},
//         {id:3, brand: 'samsung', model: 'j6', price: 10000, inStock: false}
//     ]
//     res.json(products);
// })
// move the routings to new folder
// app.get('/products',productCtrl.get);
// app.get('/health',defaultCtrl.health);

app.listen(3000,function(){
    console.log('we are listening to port', 3000 );
})