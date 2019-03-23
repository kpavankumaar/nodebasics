var express = require('express');
var mySql = require('mysql');
var app = express();
var con = mySql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password: 'Harekrishna1',
    database:'todoapp'
})
con.connect(function(err){
    if (!!err) {throw err};
    console.log('connected!');
    // con.query('CREATE DATABASE mydb1',function(err,result){
    //     if(err) throw err;
    //     console.log('Database Created');
    // });
});
app.get('/',function(req,res){
    // about mysql 
    con.query("SELECT * FROM users", function(err,rows,fields){
        if(err){
            console.log("Error in the query ")
        }else{
            console.log("successfull query");
            console.log(rows);
        }
    })
})
app.listen(1337)