/*
*helpers for various tasks 
*/
// Dependencies 
var crypto = require('crypto');
var config = require('./config');
var https = require('https');
var querystring = require('querystring')
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
    console.log('string data',str);
    try{
        console.log('inside try', str);
        var obj = JSON.parse(str);
        console.log('inside try', obj);
        return obj;
    }catch(e){
        console.log(e);
        return {};
    }
}

helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength: false;
    if(strLength){    
        // define all the possible characters that could go into string
        var possibleCharacters = 'abcdefghijklmonpqrstuvwxyz0123456789';
        var str = '';
        for (let index = 0; index < strLength; index++) {
            // get random characters from possible characters string
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // append this character to the final string
            str += randomCharacter;
        }
        return str;
    }else{
        return false;
    }
}
// send an sms message via twillio
helpers.sendTwilioSms = function(phone,msg,callback){
    // validate parameters 
    phone = typeof(phone) == 'string' && phone.trim().length == 10? phone.trim() : false;
    msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
    if (phone && msg ) {
        // configure the request payload
        var payload = {
            'From': config.twilio.fromPhone,
            'To':'+1'+phone,
            'Body': msg
        };
        // stringify the payload
        var stringPayload = querystring.stringify(payload);

        // configure the request details 
        // var requestDetails = {
        //     'protocol':'https:',
        //     'hostname': 'api.twilio.com',
        //     'method': 'POST',
        //     'path':'/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
        //     'auth': config.twilio.accountSid+':'+config.twilio.authToken,
        //     'headers':{
        //         'Content-Type' : 'application/x-www-form-urlencoded',
        //         'Content-Length': Buffer.byteLength(stringPayload)
        //     }
        // }
        // api key :WluGPf+U75Y-rHFOc2JPzZn60qQg5V5J5Syr8W2SxR
        var apikey = 'WluGPf+U75Y-rHFOc2JPzZn60qQg5V5J5Syr8W2SxR';
        var Message = 'HI';
        var Sender = 'TXTLCL'
        var numbers = '918123456789'

        myURL = "https://api.textlocal.in/send/?"
        postData = "apikey=" + apikey + "&message=" + Message + "&numbers=" + numbers + "&sender=" + Sender;
        var stringPostData = JSON.stringify(postData);
        console.log('stringPOstdata',stringPostData);
        var requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.textlocal.in',
            'method': 'POST',
            'path': '/send/?',
            'port':443,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': stringPostData.length
            }
        }
        var req = https.request(requestDetails,function(res){
            // grab the status of the sent request
            var status = res.statusCode;
            console.log('responsecode ', res);
            // callback successfully if the request went through
            if(status == 200 || status == 201){
                console.log('statuscode ',status);
                callback(false);
            }else{
                callback('status code returned was '+ status);
            }
        });
        // Bind the error event so it doesn't get thrown
        req.on('error',function(e){
            callback(e);
        })
        // add the payload 
        req.write(postData);

        // End the request
        req.end();
    }else{
        callback('Given parameters are missing or invalid');
    }
}   
// export the module 
module.exports = helpers ;