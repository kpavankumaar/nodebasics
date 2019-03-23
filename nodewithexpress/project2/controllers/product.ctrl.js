var productCtrl = { 
    get: function(req, res){
        var products = [
                        {id:1,brand:'nokia', model:'x6', price: 250, inStock: true},
                        {id:2, brand:'samsung', model: 'j6', price: 10000, inStock: true },
                        { id:3, brand:'samsung', model: 'j6', price: 10000, inStock: true }
                        ];
        res.json(products);
    },
    health: function(req, res){
        var obj = {
            status:'up'
        }
        res.json(obj);
    }
}
module.exports = productCtrl;
 
