
const Product  = require('../models/product.model');

var productCtrl = { 
    get: function(req, res){
        console.log('get method');
        // asyncronous call 
        // console.log(Product.find());
        Product.find(function (err, productData){
            // console.log(test)
            console.log(err, productData);
            if(err){
                res.status(500);
                res.send('Internal server error');
            }else{
                res.status(400);
                res.json(productData);
            }
            
        })
        // res.json(products);
    },
    getById: function(req, res){
        console.log(req.params);
        var id = +req.params.id;
        
        for (let i = 0; i < products.length; i++) {
            console.log('id', id, products[i].id);
             if(products[i].id === id){
                 console.log(products[i]);
                 res.status(200);
                 res.json(products[i]);
             }else{
                // res.status(404);
                // res.send('Not Found');
             }
            
        }
    },
    save:function(req, res){
        console.log(req.body);
        products.push(req.body);

        res.status(201); //created
        res.send(req.body);

    },
    delete:function(req,res){
        var id = parseInt(req.params.id);
        // or use +req.params.id -> +operator will convert the string value into a number
        for (let i = 0; i < products.length; i++) {
            if(products[i].id === id){
                products.splice(i,1);
                res.status(204);
                res.send();
            }else{
                res.status(404);
                res.send('Data Not Found')
            }
            
        }
    },
    update:function(req,res){
        var product = req.body;
        console.log('req.body',product , req.body);
        var id = +req.params.id;
        for (let i = 0; i < products.length; i++) {
            console.log(products[i].id, id, products[i].id === id)
            if (products[i].id === id) {
                
                products[i].brand = product.brand;
                products[i].model = product.model;
                products[i].price = product.price;
                products[i].inStock = product.inStock;
                res.status(204)
                res.send();
            } else {
                // res.status(404);
                // res.send('Data Not Found')
            }

        }
    },

    health: function(req, res){
        var obj = {
            status:'up'
        }
        res.json(obj);
    }
}
module.exports = productCtrl;
 
