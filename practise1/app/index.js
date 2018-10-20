var http = require('http')
var url = require('url')
var StringDecoder = require('string_decoder').StringDecoder;
// create http server 

var server = http.createServer(function(req,res){
	// this function is read when ever http request is made 
	console.log('http request made ');
	console.log(req.url);
	// getting the url and parse it 
	var parsedUrl = url.parse(req.url,true);
	console.log(parsedUrl);
	// get path
	var trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g,'')
	console.log(trimmedPath)
	
	// geting the http method 
	// console.log('request object : ', req)
	var method = req.method.toLowerCase();
	console.log(method);
	
	// getting the headers 
	var headers = req.headers;
	console.log(headers);

	// get the payload if any 
	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data',function(data){
		console.log(decoder.write(data));
		buffer += decoder.write(data);
		console.log(buffer);
	})
	req.on('end',function(){
		buffer += decoder.end();
		res.end('Hello world');
		console.log('request with payload ', buffer);
	})

})
server.listen('3000',function(){
	console.log('listening to port 3000');
})
// listen to a port