/*
* server related task
*
*/
// creating server 

// Dependencies 

var http = require('http');
var https = require('https');
var url = require('url');
var config = require('./config');
var fs = require('fs');
var _data = require('./data')
var handlers = require('./handlers');
var helpers = require('./helpers');
var path = require('path');

// Instantiate the sever model object 
var server = {};


// @TODO GET RID OF THIS
helpers.sendTwilioSms('9666698000', 'hello', function (err) {
    console.log('this was the error ', err);
})

_data.delete('test', 'newFile', function (err) { console.log(err) });
var StringDecoder = require('string_decoder').StringDecoder;

// server should respond to all the requests with a string
// instantiate the server
server.httpServer = http.createServer(function (req, res) {
    server.unifiedServer(req, res);
});

// instantiate https server 
server.httpsServerOptions = {
    key: fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
    cert: fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
}

// listen to  httpsServer 
server.httpsServer = https.createServer(server.httpsServerOptions, function (req, res) {
    server.unifiedServer(req, res);
})
// all the server logic for both http and https server
server.unifiedServer = function (req, res) {

    console.log('Hello world');

    // get the url and parse it 
    console.log(req.url)
    var parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl);

    // get the http method 
    var method = req.method.toLowerCase();
    // get the headers 
    var headers = req.headers;
    // get the Path
    var path = parsedUrl.pathname;

    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    console.log(trimmedPath);

    // get the query string as an object 
    var queryStringObject = parsedUrl.query;

    // get the payload, if any
    var decoder = new StringDecoder('utf-8');
    // what is utf8 link 
    // https://stackoverflow.com/questions/2241348/what-is-unicode-utf-8-utf-16
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
        console.log(buffer);
    })
    req.on('end', function () {
        buffer += decoder.end();
        // stringifiedBufferVal = JSON.stringify(buffer);
        console.log('buffer', buffer);
        var chooseHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
        var data = {
            'queryStringObject': queryStringObject, // this is information is from url 
            'trimmedPath': trimmedPath,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer) // this is the payload recieved from json data 
        }
        chooseHandler(data, function (statusCode, payLoad) {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payLoad = typeof (payLoad) == 'object' ? payLoad : {};
            var payLoadString = JSON.stringify(payLoad);
            res.setHeader('content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(payLoadString);
        })


        // log the request path
        // console.log('request recieved on path ' + trimmedPath + ' with method' + method + 'and with these query string parameters ', queryStringObject + ' with request headers '+ headers);
        console.log('request with this payload : ', buffer);
    })
}

// define the request router 
server.router = {
    'sample': handlers.sample,
    'users': handlers.users,
    'tokens': handlers.tokens,
    'checks': handlers.checks
}

// Init script
server.init =function(){
    
    // start the server , and have it listen to port 3000
    server.httpServer.listen(config.httpPort, function () {
        console.log('the server is listening to port' + config.httpPort + 'in ' + config.envName + ' mode');
    })
    // start the https server
    server.httpsServer.listen(config.httpsPort, function () {
        console.log('the https server is listening to port' + config.httpsPort + 'in ' + config.envName + ' mode');
    })
    
}

// export the module 
module.exports = server;
