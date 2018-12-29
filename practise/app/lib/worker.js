/**
 * worker related tasks
 */

 // Dependencies 
 var path = require('path');
 var fs = require('fs');
 var _data = require('./data');
 var https = require('https');
 var http = require('http');
 var helpers = require('./helpers');
 var url = require('url');

 // Instantiate the worker object 
var workers = {}

// lookup all checks , get their data, send to a validator
workers.gatherAllChecks = function(){
    // get all the checks 
    _data.list('checks',function(err,checks){
        if(!err && checks && checks.length > 0){
            checks.forEach(function(check){
                // Read in the check data
                _data.read('checks',check,function(err,originalCheckData){
                    if(!err && originalCheckData){
                        // pass it to the check validator, and let that function continue or log errors as needed 
                        workers.validateCheckData(originalCheckData);
                    }else{
                        console.log("Error reading one of the check's data ")
                    }
                })
            })
        }else{
            console.log({'Error': 'couldnot find any checks to process '})
        }
    });
}


// Sanity check the check-data
workers.validateCheckData = function(originalCheckData){
    originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData !== null ? originalCheckData : null;
    originalCheckData.id = typeof (originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false;
    originalCheckData.userPhone = typeof (originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false;
    originalCheckData.protocol = typeof (originalCheckData.protocol) == 'string' && ['http','https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
    originalCheckData.url = typeof (originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
    originalCheckData.method = typeof (originalCheckData.method) == 'string' && ['post', 'get','put', 'delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
    originalCheckData.successCodes = typeof (originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0  ? originalCheckData.successCodes : false;
    originalCheckData.timeoutSeconds = typeof (originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false;
    // set the keys that may not be set (if the workers have never seen this check before)
    // mainly there are two new keys a) state : checks if the state is currently up or down 
                                //   b) lastChecked : timestamp indicating the lasttime that this check was performed 
    originalCheckData.state = typeof (originalCheckData.state) == 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : down; 
    // down is used instead of false , this means is if a check has never been performed , if url has never been checked . we want to assume it is down 
    originalCheckData.lastChecked = typeof (originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;
    // if all the checks pass, pass the data along to the next step in the process 
    if(
        originalCheckData.id &&
        originalCheckData.userPhone &&
        originalCheckData.protocol &&
        originalCheckData.url &&
        originalCheckData.method &&
        originalCheckData.successCodes &&
        originalCheckData.timeoutSeconds
    ){
        workers.performCheck(originalCheckData);
    }else{
        console.log('one of the checks is not properly formatted , skipped it');
    }
}

// perform the check , send the originalCheckData and the outcome of the check  process, to the next step in the process
workers.performCheck = function(originalCheckData){
    // prepare the initial check outcome 
    var checkOutcome = {
        'error': false,
        'responseCode': false
    }
    // Mark that the outcome has not been sent yet
    var outcomeSent = false ;
    // parse the hostname and the path out of the original check data
    var parsedUrl = url.parse(originalCheckData.protocol+'://'+originalCheckData.url,true);
    var hostName = parsedUrl.hostname;
    var path = parsedUrl.path; // using path and "not pathname" because we want the query string 
    // construct the request 
    var requestDetails = {
        'protocol': originalCheckData.protocol+':',
        'hostname':hostName,
        'method': originalCheckData.method.toUpperCase(),
        'path': path,
        'timeoutSeconds' : originalCheckData.timeoutSeconds * 1000
    };
    // instantiate the request object (using either the http or https module)
    var _moduleToUse = originalCheckData.protocol == 'http'? http: https;
    var req = _moduleToUse.request(requestDetails,function (res) {
        // grab the status of the sent request
        var status = res.status;
        // update the check outcome and pass the data along 
        checkOutcome.responseCode = status;
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData,checkOutcome);
            outcomeSent = true;
        }
    })

}

// no matter what kind of check the user has setup we are going to execute it once per minute 
// Timer to execute the worker process once per minute 
workers.loop = function () {
    setInterval(function(){
        workers.gatherAllChecks();
    }, 1000*60);
}
// Init script
workers.init = function() {
    // Execute all the checks immediately
    workers.gatherAllChecks();
    // call the loop so the checks will execute later on
    workers.loop()
}


// Export the module 
module.exports = workers;