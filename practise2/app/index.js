
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
// creating server with node js 
var server = http.createServer(function(req,res){
    // parseUrl
    console.log(req.url);
    var parsedUrl = url.parse(req.url,true);
    // get the path 

    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/,'');
    console.log(trimmedPath);
    
    // get the query object 
    var queryStringObject = parsedUrl.query;
    console.log(queryStringObject);
    // get the http method 
    var method = req.method.toLowerCase();
    console.log(method);

    // get the http headers 
    var headers = req.headers;
    console.log(headers);
    
    //get the payload 

    var decoder = new StringDecoder('utf-8');
    var buffer = ''
    req.on('data',function(data){
        buffer += decoder.write(data);
    })
    req.on('end',function(){
        buffer += decoder.end();
        console.log(buffer);
    })

    // send  a response 
    res.end('hello world ');
})

// listen to port 3000
server.listen(3000,function(){
    console.log('you are listening to port 3000');
})
// define all the handlers 
var handler ={};

// sample handler
handler.sample = function(data , callback){
    callback(200, {'name':'sampleHandler'});
}
// notfound
handler.notFound = function(data, callback){
    callback(404);
}

// handle routers 

var router = {
    'sample' : handler.sample
}

