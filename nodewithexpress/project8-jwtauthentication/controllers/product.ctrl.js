
const productSvc = require('../services/product.svc');


var productCtrl = { 
    get: async function(req, res){
        let pageIndex = +req.params.pageIndex || 0;
        
        let pageSize = +req.params.pageSize || 10;
        let sort = req.query.sort || "lastUpdated";
        let direction = req.query.direction || "";// empty means ascending order
        // console.log(req.query.sort) // checking weather we have req.sort method to run he tests 
        // meta data for consumer 
        // here both product.count and product.find are both going to run parallely asyncronously but we need to that sequntially
        let cnt = await productSvc.count();
        let productData = await productSvc.get(pageIndex,pageSize,sort, direction);
            try{
                let totalPages = Math.ceil(cnt/pageSize);
                let metaData ={
                    count:cnt,
                    // totalPages:Math.ceil(cnt/pageSize),
                    totalPages: totalPages,
                    hasPrevious: pageIndex > 0 ,
                    hasNext: pageIndex < totalPages-1
                };
                    
                var response = {
                    metadata: metaData,
                    data:productData
                }
                res.status(200);
                res.json(response);
            }
            catch{
                res.status(500);
                res.send('Internal server error');
            }
        
            

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
    getById: async function(req, res){
        console.log(req.params);
        var id = req.params.id;
        // Product.find({_id:id},function(){
            
        // });
        //or 
        // where ever we use find() use exec for save donot use exec method
       try { // if the try block throws some exception then it will go to catch block 
           var product = await productSvc.getProductById(id)
           console.log(product);
           res.status(200).json(product);   
       } catch (error) {
           res.status(500).send('internal server error');
       } 
    //    finally{ // this will be executed in every case 
    //         console.log('Finally executed');
    //    }

        
    },
    save:async function(req, res){
        try{
            var savedPrduct = await productSvc.save(req.body);
            res.status(201)
            res.json(savedPrduct);
        }
        catch(err){
            res.status(500);
            res.send(err);
        }
        
    },
    delete:async function(req,res){
        // var id = parseInt(req.params.id);
        // or use +req.params.id -> +operator will convert the string value into a number
        var id = req.params.id;
        try{
            await productSvc.delete(id);
            res.status(204);// no content
            res.send()
        }
        catch{
            res.status(500);
            res.send('internal server error');
        }
    },
    update:async function(req,res){
    
        // var product =new Product(req.body);
        
        var id = req.params.id;
        
        try{
            await productSvc.update(id, req.body);
            res.status(204);
            res.send()
        }
        catch{
            res.status(500);
            res.send('Internal server error');
        }
    },
    patch:async function(req,res){    
        let id = req.params.id;
        delete req.body.id
        console.log(req.body);
        try{
            await productSvc.patch(id, req.body);
            res.status(204);
            res.send();
        }
        catch{
            res.status(500);
            res.send('Internal server error ');
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
 
