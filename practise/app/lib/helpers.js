/*
*helpers for various tasks 
*/
// Dependencies 
var crypto = require('crypto');
var config = require('./config')

// container for all the helpers 
var helpers = {}

// create a SHA256 hash
helpers.hash = function(str){
    if(typeof(str) == 'string'&& str.length > 0){
        // what is config.hashingSecret
        var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex'); 
        return hash;
    }else{
        return false;
    }
}

// parse a JSON string to an object in all cases , without throwing 
helpers.parseJsonToObject = function(str){
    console.log('string data', typeof str);
    try{
        console.log('inside try', obj);
        var obj = JSON.parse(str);
        console.log('inside try', obj);
        return obj;
    }catch(e){
        return {};
    }
}
// export the module 
module.exports = helpers ;