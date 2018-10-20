let http = require('http');
let url = require('url');
let StringDecoder = require('String_Decoder').StringDecoder;
let httpserver = http.createServer(function(req,res){
    console.log('requesturl ',req.url);
    let parsedUrl = url.parse(req.url,true);
    console.log(parsedUrl);
    // get path 
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    // get method information
    console.log(req.method);
    // get query 
    // get  payload 

    decoder = new StringDecoder('utf-8');
    var buffer='';
    req.on('data',function(data){
        buffer+=decoder.write(data);
    })
    req.on('end',function(end){
        buffer+=decoder.end();
        var chooseHandler = typeof(router[trimmedPath]) == 'undefined' ? handlers.notFound : router[trimmedPath];
        chooseHandler(data,function(statusCode,payload){
            payload = typeof(payload) == 'undefined' ? {}: payload;
            var payloadString = JSON.stringify(payload);
            res.setHeader('content-type','application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
        })
    })
    

})
httpserver.listen(3000,function(){
    console.log('listening to port 3000');
});
// define all handlers 
var handlers = {};
handlers.sample = function(data, callback){
    callback(200, {'name':'ravi'});
}
handlers.notFound = function(data,callback){
    callback(404);
}


// define request Router
var router = {
    'sample':handlers.sample
}
