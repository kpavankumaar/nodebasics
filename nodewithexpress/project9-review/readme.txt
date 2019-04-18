Notes
Basic authentication and token authentication 
for small projects can use basic authentication 
not beneficial we have to verify by collecting data from database everytime

token authentication we send token after the authentiction and then for further communications 
client will use token number to communicate 


Roles : Some users may have access to some data but not all 
for that we have to send the role data with token information 

so that token created from data ({username: "abc@gmail.com", role: "User or admin or manager"})
the data request from client is made with token number but this token number will only work with roles and username from which token is created 

For a read only user we should not allow to access save 
we have to pass the role
along with token 
    tokenAuth: function (req,res, next){
        let token = req.headers['authorization']
        var result = jwt.verify(token, config.jwtPassword,function(err){
            if (err) {
                res.status(401);
                res.send("Unauthorized");
            }
            else{
                next();
            }
        });

        console.log(result);
        req.role = payload.role // here role is added to the request object 
        
    }
    this request object from above function can be accessed in save method of product.ctrl.js now one can decide what we want to do .
    for a read only property save should not be accessed 


now revert back the changes 


Database Design 
everything will be part of one collection
{
    ---
    ---
    review:[{
        subject :'',
        message:'',
        rating: 4 ,
        lastUpdated:
    },{},{}]
}
you can add reviews in mongoose.model

// mongoose.model
module.exports = mongoose.model('Product',{
    // brand:{type:String, required: [true, 'brand is required' ], minlength: 3, maxlength: 10 },
    brand: { type: String, required: [true, 'brand is required'] },
    model: { type: String, required: [true, 'model is mandatory' ] },
    price: { type: Number, validate:{ validator: priceValidator }},
    inStock: { type: Boolean, default:false },
    lastUpdated: { type: Date, default: Date.now},
    reviews:[{
        subject :{ type: String, required: true},
        message:String,
        rating: Number ,
        lastUpdated:{ type: Date, Default: Date.now}
    },{},{}]
});
when we retrieve data we will retieve all the data 
but what if i have requirement to maintain the data in different collectins 

Products : // collection 1 
{
    _id:'abc-def-ghi',
    --
    --
    --
}
Reviews:  // collection 2 
{ // first review 
    productId: 'abc-def-ghi',
    subject:,
    message:,
    ----
}
{ // second review 
    productId:'abc-def-ghi',
    subject:,
    message:,
}

which approach to use if we have lot of reviews then its better use 2 collections
we will be use this approach as we have to join two different collections 



3 files are created for Reviews 

review.router.js
    --> router.post('/',routerCtrl.save())
review.ctrl.js
    --> class RouterCtrl -> save(req,res){}
review.model.js
    --> import mongoose 
    --> mongoose.model('review', {
        productId:{type:String, required:[true,"productId is required"]},
        subject:{type:String, required:[true,"subject is required"]},
        message: String,
        rating:5
    })

if the user is loading the details of products (/api/products) then please donot load reviews here . as The data for this request is general and it would be to much to load two collections
if we make api/products 
then we are making 3 databasecalls 
one for metadata 
second for productsdata 
third --> this may vary to number of documents added . if 10 documents we may make 10 database calls

then load reviews when the request is made for a specific productId 


> new topic 
Joining the collections and reviewing the data is also possible 
just make another review call from review.svc.js

// creating a code snippet with visual studio code 

go to preferences in vs code 
click on "use snippets"
 and search for javascript.json

example 1 
"cls":{
		"prefix": "cls",
		"body":[
			"class  className {",
				"",
				"get(){",
				"}",
				"",
			"}",
		
		],
		"description": "snippet to create a Class"
	}

example2 :
"cls":{
    	"prefix": "cls",
		"body":[
			"class  $1 {",
				"",
				"get(){",
				"}",
				"",
			"}",
		
		],
		"description": "snippet to create a Class"
	
}


in the above snippet helps me in placing the cursor where classname is defined 

// setting up account for mlab 
go for sandbox  not available this was not available for production version

mlab has been brought by  new website https://cloud.mongodb.com . now it mongodb atlas 






open robo 3t --
https://docs.atlas.mongodb.com/connect-to-cluster/#connect-to-a-cluster


the methodology used is called domain driven development
// DDD - Product is domain model , they will create product model . and this product model will create a database structure 
// Database Driven- 5 year or 10 years ago we use to have database driven where we use to create database and then we write code  

Domain model are easy to understand if developer looks at the productmodel ,review model , he will understand things easily 
most of the application are build using Domain driven development


Deployment-- of application 

the port available on my machine may not be available on the server 
so server now a days they give you an environment varaible to run this 
process.env.PORT - process is global object available in nodejs , env gives you  environmental variables

what are environmental variables - 
windows env variables can be configured 
similarly we have environment variables are needed for this .every operating system has them 
cloud hosting environment may have PORT environment variable to be some value 
like PORT 5000 



1. create const PORT its value will be from "process.env.PORT " 
2 . Package.json file is very very crucial file for deployment
make sure you have 
    a. main :"index.js"
    b. "scripts":{"start": "node index.js"}
    c. add "engines": {
        "node": "version number"
    }

c point will tell the hosting provider that we need this version of node thought it is optional 
what happens if you mention what is needed your code will not break out 


we will deploy it from github not from heroku 