var router = require('./router');
const express = require('express');
var app = express();



// route methods 
// app.get('/',function(req, res){ 
//     res.send('Get request to the home page ');
// })

// app.post('/',function(req,res){
//     res.send('Post request to the home page');    
// })

// app.all('/users',function(req,res,next){
//     console.log('responds to all http methods ');
//     next() // pass control to next handler
// },function(req,res){
//     res.send('all methods response ');
// })
app.listen(3001,function(){
    console.log('listening to port 3001');
})

app.use('/router',router);