/*
* Request handlers 
*/

// Dependencies 
var _data = require('./data');
var helpers = require('./helpers');


// define all handlers
var handlers = {};
// users
handlers.users = function(data, callback){
    console.log('handlers.users data.method',data.method);
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)> -1){
        handlers._users[data.method](data,callback);
    }else{
        callback(405);
    }
};
// container for user submethods 
handlers._users = {}
// Users - post 
// required data : firstname , lastname, phone, password, tosAgreement
// optional data : none 
handlers._users.post = function(data,callback){
    // check that all the required fields are filled out 
    console.log('handlers._users.post ',typeof(data.payload));
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
    console.log('inside handlers._users.post ',firstName , lastName , phone , password , tosAgreement)
    if (firstName && lastName && phone && password && tosAgreement){
        // make sure that user doesnt already exist 
        _data.read('users',phone,function(err,data){
            if(err){
                // hash the password 
                var hashedPassword = helpers.hash(password);
                // create the user object 

                if(hashedPassword){
                    var userObject = {
                    'firstName' : firstName,
                    'lastName': lastName,
                    'phone': phone,
                    'hashedPassword' : hashedPassword,
                    'tosAgreement': true
                    }
                    // store the user 
                    _data.create('users',phone,userObject,function(err){
                        if(!err){
                            callback(200);
                        }else{
                            console.log(err);
                            callback(500,{'Error':'could not create new user'})
                        }
                    })

                }else{
                    callback(500,{'Error': 'couldnot hash the users password '});
                }
                
            }else{
                callback(400,{'Errors':'user with that phone number already exists '});
            }
        })
    }else{
        // user already exists 
        callback(400,{'Error': 'missing required fields'});
    }
}
// Users - get
// required data : phone
// optional data : none
// @Todo we should only let authenticated user access the their object
// dont let anyone access other data
handlers._users.get = function(data,callback){
    // check the phone number is valid
    var phone = typeof(data.queryStringObject.phone) == "string" && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim():false;
    // get the token from the authenticated user 
    var token = typeof(data.headers.token) == "string" && data.headers.token.trim().length == 20 ? data.headers.token.trim() : false;
    console.log('handlers._users.get', token)
    if(phone){
        // verify the token id 
        handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
            if(tokenIsValid){
                // lookup the user
                _data.read('users', phone, function (err, data) {
                    if (!err && data) {
                        //Remove the hashed password from the user object before returning to requester 
                        delete data.hashedPassword;
                        callback(200, data);
                    } else {
                        callback(404);
                    }
                });
            }else{
                callback(404, {'Error':'not a valid token please login again or missing token in headers '});
            }
        })
        
        
    }else{
        callback(400,{'error':'missing required field'});
    }
}
// Users - put
// required data : Phone 
// optional data: firstname, lastname, password  atleast one must be specified
// @todo only let an authenticated user update their own object.Dont let them update anyone elses
handlers._users.put = function(data,callback){
    // check for the required field 
    var phone = typeof (data.payload.phone) == "string" && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    // check for the optional fields 
    var firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    // Error if phone is invalid
    if(phone){
        //Error is nothing is sent to update
        if(firstName || lastName || password){
            var token = typeof (data.headers.token) == "string" && data.headers.token.trim().length == 20 ? data.headers.token.trim() : false;
            handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
                if(tokenIsValid){
                    // lookup the user 
                    _data.read('users', phone, function (err, userData) {
                        if (!err && userData) {
                            // update the fields that are necessary 
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.hashedPassword = helpers.hash(password);
                            }
                            // store the new updates 
                            _data.update('users', phone, userData, function (err) {
                                if (!err) {
                                    callback(200);
                                } else {
                                    console.log(err);
                                    callback(500, { "Error": "couldnot update the user" });
                                }
                            })
                        } else {
                            callback(400, { 'Error': 'the specified user doesnot exist' });
                        }
                    });
                }else{
                    callback(404, { 'Error': 'not a valid token please login again or missing token in headers ' });
                }
            })
            
        }else{
            callback(400, {'Error': 'missings fields to update'})
        }
    }else{

    }
}
// Users - delete

handlers._users.delete = function(data,callback){ // data is the object created in index.js using the values recieved from http request of the client 
    // check that the phone number is valid 
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10? data.queryStringObject.phone : false;
    if(phone){
        var token = typeof (data.headers.token) == "string" && data.headers.token.trim() == 20 ? data.headers.token.trim() : false;
        handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
            if (tokenIsValid) {
                _data.read('users', phone, function (err, data) {
                    if (!err && data) {
                        _data.delete('users', phone, function (msg) {
                            console.log('handlers._users.delete',msg);
                        });
                    } else {
                        callback(400, { 'Error': 'specified user not found ' })
                    }
                })
            }else{
                callback(404, { 'Error': 'not a valid token please login again or missing token in headers ' });
            }
        })
        
    }else{
        callback(400,{'Error': 'Missing required field'});
    }
}   
// tokens
handlers.tokens = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};
// container for all token methods 
handlers._tokens = {};

// Tokens -post
// Requied data : Phone and password,
// optional data is none 
handlers._tokens.post = function(data,callback){
    
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    console.log(' handlers._tokens.post phone', phone);
    console.log('handlers._tokens.post password', password);
    if(phone && password){
        // lookup the user who matches the phone number 
        _data.read('users',phone,function(err,userData){
            if(!err && userData){
                // Hash the sent password and compare it to the password stored in user object 
                var hashedPassword = helpers.hash(password);
                if (hashedPassword == userData.hashedPassword) {
                    // create a token with a random name 
                    // set expiration data 1 hr 
                    // creating a strin of lenght 20 
                    var tokenId = helpers.createRandomString(20);
                    var expires = Date.now() + 1000 * 60 * 60;
                    var tokenObject = {
                        'phone':phone,
                        'id': tokenId,
                        'expires':expires
                    };
                    // strore the token 
                    _data.create('tokens',tokenId,tokenObject,function(err){
                        if(!err){
                            callback(200,tokenObject);
                        }else{
                            callback(500,{'Error': 'could not create the new token '});
                        }
                    })
                } else {
                    callback(400,{'Error':'password did not match the specified users stored password'})
                }

            }else{
                callback(400,{'Error':'Couldnot find specified user'});
            }
        })
    }else{
        callback(400,{'Error':'Missing Required Fields'})
    }
}
// Tokens -get
// Required Data : id 

handlers._tokens.get = function (data, callback) {
    var id = typeof(data.queryStringObject.id.trim()) == 'string' && data.queryStringObject.id.trim().length > 0 ? data.queryStringObject.id.trim() : false;
    if(id){
        console.log(" handlers._tokens.get id", id);
        _data.read('tokens',id,function(err,data){
            console.log(' handlers._tokens.get tokens read data',data);
            if(!err && data){
                callback(200, data);
            }else{
                callback(500,{'Error':'Error reading data'});
            }
            
        })
    }else{
        callback(400, {'Error': 'token id doesnot exist'});
    }
}
// Tokens -put
// required data: id and extend time
// optional data : none
handlers._tokens.put = function (data, callback) {
    // extended time should be boolean
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length > 0 ? data.payload.id.trim(): false;
    var expires = typeof(data.payload.expires) == 'boolean' && data.payload.expires == true ? true: false;
    if(id && expires){
        _data.read('tokens',id,function(err,tokenData){
            if(!err && tokenData){
                if(tokenData.expires > Date.now()){
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    _data.update('tokens',id,tokenData,function(err){
                        if(!err){
                            callback(200);
                        }else{
                            callback(500,{'Error':'Unable to update the tokens expiration '});
                        }
                    })
                }else{
                    callback(404,{'Error': 'time has already expired'})
                }
                
            }else{
                callback(400,{'Error': ' requested id doesnot exist'})
            }
        })

        
    }else{
        callback(404,{'Error':'missing data from payload'})
    }
}
// Tokens -delete
handlers._tokens.delete = function (data, callback) {
    // check that the phone number is valid 
    var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id : false;
    if (id) {
        _data.read('tokens', id, function (err, data) {
            if (!err && data) {
                _data.delete('tokens', id, function (msg) {
                    console.log('handlers._tokens.delete msg',msg);
                });
            } else {
                callback(400, { 'Error': 'specified user not found ' })
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
}
// verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function(tokenId,phone,callback){
   
    // look up the token 
    _data.read('tokens',tokenId,function(err,tokenData){
        console.log('handlers._tokens.verifyToken', tokenData.expires);
        if(!err && tokenData){
            // check that the token is for the given user and has not expired
            console.log('handlers._tokens.verifyToken', tokenData.expires> Date.now())
            if(tokenData.phone == phone && tokenData.expires > Date.now()){
                callback(true);
            }else{
                callback(false);
                // callback(400,{'Error':'sent token doesnot match with phonenumber'})
            }       
        }else{
            callback(false);
            // callback(400,{'Error': 'Cannot match any files with the specified token'})
        }
    })

}
// checks 
handlers.checks = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)> -1){
        handlers._checks[data.method](data,callback);
    }else{
        callback(404);
    }
}
// container for all the check methods 
handlers._checks = {};

// checks post
// Required data : protocol, url, method, successCodes, timeoutseconds
// optionaldata : none
handlers._checks.post = function(){
    // validate inputs 
    var protocol = typeof(data.payload.protocol) == 'string' && ['http','https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol.trim() : false;
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim(): false;
    var method = typeoftypeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method.trim() : false;
    var successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
    if(protocol &&  url && method && successCodes && timeoutSeconds){
        // get the tokens from the headers 
        var token  = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // lookup the user by reading the token
        _data.read('tokens',token, function(err, tokenData){
            if(!err && tokenData){
                var userPhone = tokenData.phone;
                // lookup the userdata
                _data.read('users',userPhone,function(err,userData){
                    if(!err && userData){
                        var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks: [];
                        // verify that the user has less than the number of max-checks-per-user
                        if(userChecks.length< config.maxChecks){
                            // create a random id for the check 
                            var checkId = helpers.createRandomString(20);
                            // create the check object, and include the users phone 
                            var checkObject = {
                                'id': checkId,
                                'userPhone': userPhone,
                                'protocol': protocol,
                                'url': url,
                                'method': method,
                                'successCodes': successCodes,
                                'timeoutSeconds': timeoutSeconds
                            }
                            // save the object 
                            _data.create('checks',checkId,checkObject,function(err){
                                if(!err){
                                    // add the checkId  to the users object
                                    userData.checks = userChecks;
                                    userData.checks.push(checkId);
                                    // save the new user data
                                    _data.update('users',userPhone,userData,function(err){
                                        if(!err){
                                            // return the data about the new check 
                                            callback(200,checkObject);
                                        }else{
                                            callback(500,{'Error':'Couldnot update the user with new check'})
                                        }
                                    })
                                }else{
                                    callback(500, {'Error': 'Could not create the new check '});
                                }
                            })
                        }else{
                            callback(400, {'Error': 'user has already has maximum number of checks ('+ config.maxChecks+')'});
                        }

                    }
                })
            }else{
                callback(403);
            }
        });
    }else{

        callback(400,{'Error':' Missing required inputs, or inputs are invalid  '})
    }
}

handlers.sample = function(data,callback){
    callback(200,{'name': 'sample handler'})
}

handlers.notFound = function(data,callback){
    callback(404);
}

module.exports = handlers;  