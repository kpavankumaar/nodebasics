
const Product  = require('../models/product.model'); // Product is a model reference 

var productCtrl = { 
    get: function(req, res){
        console.log('get method');
        let pageIndex =  0
        if (req.params.pageIndex) {
            pageIndex = +req.params.pageIndex
        }
        
        let pageSize  = 10
        if (req.params.pageSize) {
            pageSize = +req.params.pageSize;     
        }
       
        // meta data for consumer 
        // here both product.count and product.find are both going to run parallely asyncronously but we need to that sequntially
        Product.count()
            .exec()
            .then(cnt => {
                let totalPages = Math.ceil(cnt/pageSize);
                let metaData ={
                    count:cnt,
                    // totalPages:Math.ceil(cnt/pageSize),
                    totalPages: totalPages,
                    hasPrevious: pageIndex > 0 ,
                    hasNext: pageIndex < totalPages-1
                };
                Product.find()
                    .skip(pageIndex * pageSize)
                    .limit(pageSize)
                    .exec()
                    .then(function (productData) {
                        var response = {
                            metadata: metaData,
                            data:productData
                        }
                        res.status(200);
                        res.json(response);
                    })
                    .catch(function (err) {
                        res.status(500);
                        res.send('Internal server error');
                    })
                
            })

        // asyncronous call 
        // console.log(Product.find());
        // Product.find()
        // .skip(pageIndex * pageSize + 1 )
        // .limit(pageSize)
        // .exec()
        // .then(function (productData){
        //     res.status(200);
        //     res.json(productData);
        // })
        // .catch(function(err){
        //     res.status(500);
        //     res.send('Internal server error');
        // })
    },
    getById: function(req, res){
        console.log(req.params);
        var id = req.params.id;
        // Product.find({_id:id},function(){
            
        // });
        //or 
        // where ever we use find() use exec for save donot use exec method
        Product.findById(id)
        .exec()
        .then(function(product){
            res.status(200);
            res.json(product);
        })
        .catch(function(err){
            res.status(404);
            res.send("Not Found");
        })
    },
    save:function(req, res){
        var product = new Product(req.body);// this is mongoose model , req.body is a json data and we are converting it into mongoose model by passong req.body
        // save is a database call . asyncronous call
        product.save()
        .then(function(savedProduct){
            res.status(201);
            res.json(savedProduct);
        })
        .catch(function(err){
            res.status(err);
            res.send("internal server error");
        })
        
    },
    delete:function(req,res){
        // var id = parseInt(req.params.id);
        // or use +req.params.id -> +operator will convert the string value into a number
        var id = req.params.id;
       Product.findByIdAndRemove(id)
        .exec()
        .then(function(product){
            res.status(204);// no content
            res.send()
        })
        .catch(function(){
            res.status(500);
            res.send('internal server error');
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
 
