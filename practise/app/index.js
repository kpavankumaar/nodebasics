/*
	primary file for the api
*/
 // basic scaffolding 
// console.log('Hello world')
// creating server 

// Dependencies 
var http = require('http');
var https = require('https');
var url = require('url');
var config = require('./lib/config');
var fs = require('fs');
var _data = require('./lib/data')
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');
// only  a test 
// _data.create('test','newFile',{'name':'pavan'},function(err){
// 	console.log('error message ',err);
// })

// _data.read('test','newFile',function(err,data){
// 	console.log('err', err );
// 	console.log('data ', data);
// })

// _data.update('test','newFile',{'name':'ravi'},function(err){
// 	console.log('error ',err );
// })

_data.delete('test','newFile',function(err){console.log(err)});
var StringDecoder = require('string_decoder').StringDecoder;

// server should respond to all the requests with a string
// instantiate the server
var httpServer = http.createServer(function(req,res){
	unifiedServer(req,res);
});



// start the server , and have it listen to port 3000
httpServer.listen(config.httpPort,function(){
	console.log('the server is listening to port'+config.httpPort+'in '+config.envName+' mode');
})


// instantiate https server 
var httpsServerOptions ={
	key:fs.readFileSync('./https/key.pem'),
	cert:fs.readFileSync('./https/cert.pem')
}
var httpsServer = https.createServer(httpsServerOptions, function(req,res){
	unifiedServer(req,res);
})

// listen to  httpsServer 
httpsServer.listen(config.httpsPort,function(){
	console.log('the https server is listening to port'+config.httpsPort+'in '+config.envName+' mode');	
})
// all the server logic for both http and https server
var unifiedServer = function(req,res){

	console.log('Hello world');

	// get the url and parse it 
	console.log(req.url)
	var parsedUrl = url.parse(req.url,true);
	console.log(parsedUrl);

	// get the http method 
	var method = req.method.toLowerCase();
	// get the headers 
	var headers = req.headers;
	// get the Path
	var path = parsedUrl.pathname;

	var trimmedPath = path.replace(/^\/+|\/+$/g,'');
	console.log(trimmedPath);

	// get the query string as an object 
	var queryStringObject = parsedUrl.query;

	// get the payload, if any
	var decoder = new StringDecoder('utf-8');
	// what is utf8 link 
	// https://stackoverflow.com/questions/2241348/what-is-unicode-utf-8-utf-16
	var buffer = '';
	req.on('data',function(data){
		buffer += decoder.write(data);
		console.log(buffer);
	})
	req.on('end',function(){
		buffer += decoder.end();
		console.log('buffer', buffer);
		var chooseHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
		var data = {
			'queryStringObject': queryStringObject,
			'trimmedPath': trimmedPath,
			'method': method,
			'headers': headers,
			'payload': helpers.parseJsonToObject(buffer)
		}
		chooseHandler(data,function(statusCode, payLoad){
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			payLoad = typeof(payLoad) == 'object' ? payLoad : {};
			var payLoadString = JSON.stringify(payLoad);
			res.setHeader('content-type','application/json');
			res.writeHead(statusCode);
			res.end(payLoadString);
		})
		

	// log the request path
	// console.log('request recieved on path ' + trimmedPath + ' with method' + method + 'and with these query string parameters ', queryStringObject + ' with request headers '+ headers);
		console.log('request with this payload : ',  buffer);
	})
	

	// send the response 
	// res.end('Hello world ');

	// // log the request path
	// // console.log('request recieved on path ' + trimmedPath + ' with method' + method + 'and with these query string parameters ', queryStringObject + ' with request headers '+ headers);
	// console.log('request headers : ',  headers);

}

// 
// // define all handlers
// var handlers = {};

//  handlers.sample = function(data,callback){
//  	callback(200,{'name': 'sample handler'})
//  }

//  handlers.notFound = function(data,callback){
//  	callback(404);
//  }

// define the request router 
var router = {
	'sample': handlers.sample,
	'users': handlers.users,
	'tokens': handlers.tokens
}

