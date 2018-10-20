// client side server validation 
// server side validation
// IOT can be done 
// javascript can be used for machine learning
// electron 
// server side coding  , api ,websites ,chat application
// asyncronous operations timers ,Http, file IO, DB calls  
// routing 
// course id divided into 3 parts 
    // writing apis  webservices, restapis, restfull services
    // writing mvc files , here we will be dealing with html pages 
    // writing chat application . will show you how sockets works in nodejs

// while and for  loop are not asyncronous
// console.log("Hello Node js ");

// function addAsync (a,b,cb){
//     console.log('execution started');
//     setTimeout(function(){
//         console.log("calculation completed ");
//         var c = a + b;
//         cb(c);
//     },1000)
//     console.log('execution stopped');
// }
// function callback(res){
//     console.log(res);
// }


// server side code 
var http = require('http');
var fs = require('fs');

function handleRequests(req,res){
    console.log(req.url);
    // console.log(res);
    switch (req.url) {
        case '/':
            var contents = fs.readFileSync("index.html")
            res.write(contents);
            res.end();        
            break;
        case '/books':
            var books = [{
                id:1, 
                name: "speaking.js",
                author: "Author 1",
                price : 100
            },{
                id:2, 
                name: "Eloquent.js",
                author: "Author 2",
                price : 100

            },{
                id: 1,
                name: "book.js",
                author: "Author 3",
                price: 100
            }]
            res.write(JSON.stringify(books));
            res.end();

            break;
        case '/authors':
            res.write("list of Authors");
            res.end();

            break;    
        default:
            res.write("NOde js");
            res.end();
            break;
    }
    
}


var server = http.createServer(handleRequests);
server.listen(3000,cb);

function cb () {
    console.log('server is running on 3000');
}
