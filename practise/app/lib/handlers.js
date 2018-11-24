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
    console.log('inside userspost',typeof(data.payload));
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
    console.log(firstName , lastName , phone , password , tosAgreement)
    if(firstName && lastName && phone && password && tosAgreement){
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
    if(phone){
        // lookup the user
        _data.read('users',phone,function(err, data){
            if(!err && data){
                 //Remove the hashed password from the user object before returning to requester 
                delete data.hashedPassword;
                callback(200,data);
            }else{
                callback(404);
            }
        });
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
            // lookup the user 
            _data.read('users',phone,function(err,userData){
                if(!err && userData){
                    // update the fields that are necessary 
                    if(firstName){
                        userData.firstName = firstName;
                    }
                    if(lastName){
                        userData.lastName = lastName;
                    }
                    if(password){
                        userData.hashedPassword = helpers.hash(password);
                    }
                    // store the new updates 
                    _data.update('users',phone,userData,function(err){
                        if(!err){
                            callback(200);
                        }else{
                            console.log(err);
                            callback(500,{"Error":"couldnot update the user"});
                        }
                    })
                } else{
                    callback(400,{'Error':'the specified user doesnot exist'}); 
                }
            })
        }else{
            callback(400, {'Error': 'missings fields to update'})
        }
    }else{

    }
}
// Users - delete
handlers._users.delete = function(data,callback){

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
    if(phone && password){
        // lookup the user who matches the phone number 
        _data.read('users',phone,function(err,userData){
            if(!err && userData){
                // Hash the sent password and compare it to the password stored in user object 
                var hashedPassword = helpers.hash(password);
                if (hashedPassword == userData.hashedPassword) {
                    
                } else {
                    
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
handlers._tokens.get = function (data, callback) {

}
// Tokens -put
handlers._tokens.put = function (data, callback) {

}
// Tokens -delete
handlers._tokens.delete = function (data, callback) {

}



handlers.sample = function(data,callback){
    callback(200,{'name': 'sample handler'})
}

handlers.notFound = function(data,callback){
    callback(404);
}

module.exports = handlers;