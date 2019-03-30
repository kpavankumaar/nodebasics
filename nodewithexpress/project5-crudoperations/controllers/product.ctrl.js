
const Product  = require('../models/product.model'); // Product is a model reference 

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
        var id = req.params.id;
        // Product.find({_id:id},function(){
            
        // });
        //or 
        Product.findById(id, function(err, product){
            if(product){
                res.status(200);
                res.json(product);
            }else{
                res.status(404);
                res.send("Not Found");
            }
        })

    },
    save:function(req, res){
        var product = new Product(req.body);// this is mongoose model , req.body is a json data and we are converting it into mongoose model by passong req.body
        // save is a database call . asyncronous call
        product.save(function(err, savedProduct){ // save function returns me the data that is saved 
            if(err){
                res.status(err);
                res.send("internal server error");
            }else{
                res.status(201);
                res.json(savedProduct);
            }
        })
    },
    delete:function(req,res){
        // var id = parseInt(req.params.id);
        // or use +req.params.id -> +operator will convert the string value into a number
        var id = req.params.id;
       Product.findByIdAndRemove(id,function(err){
         if (err) {
            res.status(500);
            res.send('internal server error');

         }else{
             res.status(204);// no content
             res.send()
         }
       })
    },
    update:function(req,res){
    
        // var product =new Product(req.body);
        
        var id = req.params.id;
        Product.findByIdAndUpdate(id,{
            $set:{
                brand:req.body.brand,
                model:req.body.model,
                price:req.body.price,
                inStock: req.body.inStock
            }
        },function(err){
            if(!err){
                res.status(204);
                res.send()
            }else{
                res.status(500);
                res.send('Internal server error');
            }
            
        })
    },
    patch:function(req,res){    
        let id = req.params.id;
        delete req.body.id
        Product.findById(id,function(err, product){
            if(product){
                for (const key in req.body) {
                   product[key] = req.body[key];

                }
                Product.findByIdAndUpdate( id, product, function(err){
                    if(!err){
                        res.status(204);
                        res.send()
                    }else{
                        res.status(500);
                        res.send('internal server error ');
                    }
                })      
            }else{
                res.status(404);
                res.send('Record not found');
            }
        })

    },

    health: function(req, res){
        var obj = {
            status:'up'
        }
        res.json(obj);
    }
}
module.exports = productCtrl;
 
