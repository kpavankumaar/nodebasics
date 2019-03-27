mongo db

install mongodb go to website
https://www.mongodb.com/download-center/community

In windows after setting up mongo db go to c drive and create 'data/db' folder
this above folder will be used for storing collections


now open terminal or command prompt run mongod -> mongo deamon 

any database server runs in the background service 
how to start 
in terminal type mongod and start the mongo db server  // this command didnot work in terminal
    find out list of tasks running on machine 
   command : -  sudo lsof -iTCP -sTCP:LISTEN -n -P
   command : - sudo kill <mongo_command_pid>
   command : - mongod
   error : msg 
   persmission denied
   aborting after fassert() failure
   try: 
   sudo mongod

next open another tab in terminal and type mongo  
gives me access to type mongo db commands 
show dbs 

show dbs -> will show exising databases 
use databasename -> will allow to access db containing collections or creates a new data base 
show collections -> will show collections in database
db.products.find(); --> returns json objects 
db.products.findOne() --> will result in first document from collection
db.products.insert({name:'krishna'}) will add the data at the end of the collection
{ "_id" : ObjectId("5c98c02dae32086258e6f605"), "name" : "krishna" }
ObjectId is a data type 
like number, string, boolean, array, ObjectId

db.products.insert({_id:1, name:'radhe'});
how to find a particular document from collection 
db.products.find({_id:"k.pavankumaar@gmail.com"})
                         

download robo 3t 
afte intalling robo 3t 
open the application it will prompt to connect through port 27017
click on "connect"

open customers database and rightclick on customernames collections and choose view documents

db.products.remove({_id:"k.pavankumaar@gmail.com"})
db.products.update(
    {
        name:'krishna'
    },
    {
        $set:{name:'radhekrishna'}
    }

)
update method accepts two parameters. first one for selecting the document and second one to update the fields of document

db.products.updateOne() -> will update the top document in collection

db.products.find({},{email:1,active:1})

first parameter is the filter and second parameter is to choose the fields to display

if you want to discard certain fields from being displayed 

db.products.find({},{_id:0})

zero number is to discard a field from displaying
and if you dont need any other field then set value for the key as 0.

db.products.findOne({brand:"samsung"},{_id:0}) // will help you find the first document among {brand:"samsung"}


// operators  $gt, $gte

example1
db.products.find({
    price:{$gt:250}
})
// will result in records whose price is greater than 250


example2 
db.products.find({
    price:{$gte:250}
})
// will result in records whose price is greater than and equal to 250;

example3
db.products.find({
    price:{$lt:250}
})
// will result in records whose price is less than  250;

example4
db.products.find({
    price:{$lte:250}
})
// will result in records whose price is less than and equal to 250;

example5
db.products.find({
    price:{$ne:250}
})
// will result in records whose price is not equal to 250;

example6
db.products.find({
    price:{$in:[200,250]}
})
// will result in records whose price is in range of 200 - 250;


example7 
db.products.find({
    price:{$nin:[200,250]}
})
// will result in records whose price is not in range of 200 - 250;


----> get count of documents in collections
example8
db.product.count()
// results in number of documents in a collection

example9
db.product.count({price:2000})
// results in number of documents in a collection whose price is 2000

note : first parameter is always a filter 

example10
db.product.count(
    {price:2000}
    )
    .limit(5)
// results in top 5  documents in a collection whose price is 2000
// this limit will help in fetching data for pagination page


example 11 --> finddocuments and delete one document from result

You need to perform two separate queries for this

take only one item from the matching filters

var item = db.collection.findOne({'condition':'some condition'})
and delete the item by using the id

 db.collection.remove({_id: item._id});


After learning how to use mongodb commands that run in robo 3t . 
we have to learn about communicating from node platform to mongo db platform
fact is we cannot use same commands for node platform
// --- installing mongoose --
npm i mongoose -s for previous versions of node platform
npm i mongoose for latest versions

GO TO robo 3t 

db.users.find()
var product = {
    brand:"samsung",
    model:"s10",
    price: 2000
}
db.users.insert(product);


users collection previous documents may not have the same document structure 
but in mongodb it doesnot matter weather we use same structure for new document inserted 
that is not the case with RDBMS

so we have to take care of the document structure before inserting . 
we do that at application level and not at the db server
we can do that with mongoose 
mongoose is like hibernate with java 

so how to connect  mongo db and node server 

step 1
in index.js file  import mongoose 
const mongoose  = require('mongoose');

step 2
mongoose.connect("mongodb://localhost:27017/nbits-products",()=> {
    console.log('db connected');
});
nbits-products creates the database if it doesnot exist

step3 
create a new directory models and a file product.model.js
const mongoose = require('mongoose');

module.exports = mongoose.model('Product',{
    brand:String,
    model:String,
    price:Number,
    inStock: boolean
})

only these fields are going to saved in database . even if we send more than these fields 
they will be discarded 

import this model into productCtrl 

const Product  = require('../models/product.model');

var productCtrl = { 
    get: function(req, res){
        // asyncronous call
        Product.find(function(products,err){
            res.status(200);
            res.json(products);

        }); // here we donot write db.Product.find().mongoose will run db.product.find() in database
        res.json(products);
    },
}







