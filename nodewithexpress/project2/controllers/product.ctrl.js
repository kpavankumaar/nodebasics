var products = [
    { id: 1, brand: 'nokia', model: 'x6', price: 250, inStock: true },
    { id: 2, brand: 'samsung', model: 'j6', price: 10000, inStock: true },
    { id: 3, brand: 'samsung', model: 'j6', price: 10000, inStock: true }
];

var productCtrl = { 
    get: function(req, res){
        res.json(products);
    },
    getById: function(req, res){
        var id = req.params.id
        for (let i = 0; i < products.length; i++) {
             if(products[i].id === id){
                 res.status(200);
                 res.json(products[i]);
             }else{
                res.status(404);
                res.send('Not Found');
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
        var id = +req.params.id;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                products[i].brand = product.brand;
                products[i].brand = product.model;
                products[i].price = product.price;
                products[i].inStock = product.inStock;
                res.status(404)
                res.send();
            } else {
                res.status(404);
                res.send('Data Not Found')
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
 
