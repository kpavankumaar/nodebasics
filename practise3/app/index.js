let http = require('http');
let https = require('https');
let stringDecoder = require('string_decoder').StringDecoder;
let url = require('url');
let config = require('./config');
let fs = require('fs');

var buffer = '';

let httpServer = http.createServer(function(req,res){
    unifiedServer(req,res);
});

console.log(config.httpPort);
httpServer.listen(config.httpPort ,function(){
    console.log(' you are listening to port '+ config.httpPort + ' running in ' + config.envName);
})
let httpsServerOption = {
    key:fs.readFileSync('./https/key.pem'),
    cert:fs.readFileSync('./https/cert.pem')
}
// https server 
let httpsServer = https.createServer(httpsServerOption, function(req,res){
    unifiedServer(req,res);
})
httpsServer.listen(config.httpsPort,function(){
    console.log(' you are listening to port ' + config.httpsPort + ' running in ' + config.envName)
})

// unified server 
var unifiedServer = function (req, res) {
    let method = req.method.toLowerCase();
    console.log(method);
    let headers = req.headers;
    console.log(headers);
    // identifying the path
    let parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '')
    console.log(parsedUrl);
    console.log(path);
    let decoder = new stringDecoder('utf-8');

    req.on('data', function (data) {
        buffer += decoder.write(data);
        console.log('data', buffer);
    })
    req.on('end', function (data) {
        buffer += decoder.end();
        console.log('end ', buffer);
        var chooseHandler = typeof (router[trimmedPath]) !== 'undefined' ? handler.sample : handler.notFound;

        var data = {
            trimmedpath: trimmedPath,
            query: parsedUrl.pathname
        }
        chooseHandler(data, function (statusCode, payload) {
            payload = typeof (payload) == 'object' ? payload : {}
            var stringifiedPayload = JSON.stringify(payload)
            res.writeHead(statusCode);
            res.end(stringifiedPayload);
        })
    })

}

// define all handlers
let handler = {}

// sample handler 
handler.sample = function(data, callback) {
    callback(200,{'name' :'samplehandler'})
}
// default handler 
handler.notFound = function(data,callback){
    callback(400)
}

// hanler routers 
var router = {
    'sample': handler.sample
}




