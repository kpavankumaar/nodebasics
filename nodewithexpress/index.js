var express = require('express');
var StringDecoder = require('String_Decoder').StringDecoder
var decoder = new StringDecoder('utf-8');
var buffer = '';
var app = express();

app.listen(3000,function(){
    console.log('server is running on port 3000');
})
app.get('/',function(req, res){
    console.log('request',req);
    res.status(200);
    // res.writeHead();
    res.end('Hello world');
})
app.post('/users',function(req,res){
    console.log('req.path',req.path);
    req.on('data',function(chunk){
        console.log(chunk);
        buffer += decoder.write(chunk);
        console.log(buffer);
    })
    req.on('end',function(){
        buffer += decoder.end();
        console.log('buffer', buffer);
    })
    res.status(201);
    res.end('updated data');
})  
