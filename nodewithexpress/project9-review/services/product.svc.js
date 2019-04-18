

const Product = require('../models/product.model');


class ProductService{
    get(pageIndex,pageSize,sort,direction){
        
        // if(direction === 'asc') direction = '';
        // else direction = '-';
        // console.log(Product.find({}));
        // console.log("product in product service",Product.find({}).exec());
        direction = direction ==='desc' ? "-":""; // direction will be used as prefix for sort to descide ascending and descending aproach   
        return Product.find({}).exec();
        // .then((res)=>{console.log('resolved',res)},(err)=>{console.log('reject',err)});
        // return Product.find({},{__v:0})
        // .sort(direction + sort)  // -sort will do descending and sort will do ascending sorting
        // .skip(pageIndex * pageSize)
        // .limit(pageSize)
        // .exec();
    }
    getProductById(id) {
        return Product.findById(id,{__v:0}).exec();
    }
    save(obj){
        var product = new Product(obj);
        return product.save();
    }
    delete(id){
        return Product.findByIdAndRemove(id).exec()
    }
    update(id,obj){
        return Product.findByIdAndUpdate(id, {
            $set: {
                brand: obj.brand,
                model: obj.model,
                price: obj.price,
                inStock: obj.inStock
            }
        }).exec()
    }
    patch(id,data){
        console.log(data);
        Product.findById(id, function (err, product) {
            if (product) {
                for (const key in data) {
                    product[key] = data[key];
                }
            return Product.findByIdAndUpdate(id, product).exec();
            }
        });
    }
    count(){
        return Product.count().exec();
    }

}

module.exports = new ProductService();


