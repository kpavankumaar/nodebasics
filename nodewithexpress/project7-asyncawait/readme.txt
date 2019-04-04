lets focus on posting data 
product controller is the place where entire logic is residing

saved and returned data from server to client
{"_id":"5c9b5a95b672df783756a162","brand":"Motorolla","model":"motoz","price":500,"inStock":true,"__v":0}

__v is model tracking by mongoose
mongoose keeps track of model changes 


// pagination

pageSize - 10 
pageIndex 0 - 9 
100 records ==> 100/10 ==> totalrecords/ pageSize  10

1st page            pageIndex + pageSize --> 0 + 10 = 10 |  pageIndex * pageSize 
0 --- 9  

2nd page            pageIndex + pageSize --> 1 + 10 = 11 
10 --- 19

3rd page            pageIndex + pageSize --> 2 + 10 = 12 
20 --- 29




// debugging in vs code is easy 
step1: click on bug icon on vscode 
step2: and open product.ctrl.js 
step3: apply breakpoint to the leftside of line numbers 
step4: and then click on > play button on the top left hand corner 
vs code throws an error 

error: Attribute 'program' does not exist” 
solution : 
VSCode defines the parent directory of its configuration file ".vscode/launch.json" as "${workspaceRoot}" or "${workspaceFolder}".

So, for example, if you want to run file "myproject/subfolder/main.js", you should configure your "myproject/.vscode/launch.json" as follows: 
"program": "${workspaceRoot}/subfolder/main.js"

Note that configuring 
"program": "${workspaceRoot}/myproject/subfolder/main.js"
is a mistake and will cause error "Attribute 'program' does not exist".
------ solution completed --------

step5: now click on the > play button but it again throw the error because the application was already running 
so killed the previously running server 
step6: again clicked on the > play icon then it runs and now refresh the chrome page loading the application 
control will stop the break point 
step7: you have watch section , add field name or a property in them see the value changes as node reads the application


in the post method when we send the emty object it stores the content into mongodb 
this is not good 
through postman send empty data 
now add validation rule in models/product.model.js

function priceValidator(value){
    return value >= 100
}
module.exports = mongoose.model('Product',{
    brand:{type:String, required: [true, 'brand is required' ] },
    model: { type: String, required: [true, 'model is mandatory' ] },
    price: { type: Number, validate:{ validator: priceValidator }},
    inStock: { type: Boolean, default:false },
    lastUpdated: { type: Date, default: Date.now}
});


now if you post url without data then error msg 

err-> {
    "errors": {
        "brand": {
            "message": "Path `brand` is required.",
            "name": "ValidatorError",
            "properties": {
                "message": "Path `brand` is required.",
                "type": "required",
                "path": "brand"
            },
            "kind": "required",
            "path": "brand"
        }
    },
    "_message": "Product validation failed",
    "message": "Product validation failed: brand: Path `brand` is required.",
    "name": "ValidationError"
}
-- second testing 
post this sample data 
{
	"brand":"samsung",
	"model":"s8",
	"price":20,
	"inStock":false
}
where price value is less than 100 ;
this will result in error messages 

===============================================
authentication 
two types of authentication
1. basic 

    we are building rest api  which is purely stateless. it doesnot remember previous request 
    and server really donot care weather the request made is old or new. Every request is treated as new request .
    that means no sessions .
    In MVC applications we have sessions .where user will login ,session is estd . session may last from 20 mins to days 
    that session once is expired user is not authorised. As long as session is active user can access all the private pages .

    in Rest api we should not have any sessions or should not have any statemanagement techniques 

    so what we do we send the credentials each time 
    each request is a new request 

Implementation

make the /api/products path to be private and default router to be public
there may be api end points that are public and some private

before we discuss about authentication we have to learn about concept called middleware 

middleware defination : it is like filter in a pipeline 
middleware is like a handler with req, res object . but it doesnot handle the request but rather it will modify the request .
it acts as interface inbetween and most of the times it doesnot send response to the requests.





go to index.js
add a middleware function , middleware functions are like interceptors look out for imagefile in project workspaceFolder


app.use(myMiddleware)
position of app.use(myMiddleware) is important , currently this above statement is added after defaultRouter api end point is registered .
so middleware will not run for default route paths 
but as the app.use(myMiddleware)is added in before the app.use('/api/products') . myMiddleware function is called every time client reaches the endpoint "api/products"

function myMiddleware(req,res,next){
    console.log("Inside Middleware");
    next();// means go ahead and it is a function 
}

// registration of middleware
app.use(myMiddleware);
// private 
app.use('/api/products',productRouter);


encodeing and decodeing is different from encrytion and decryption



change the name of the function myMiddleware to "authenticate"





 







