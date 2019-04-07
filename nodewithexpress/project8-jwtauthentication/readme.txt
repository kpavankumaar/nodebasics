to any request made by client in restfull apis we have to send credentials everytime we make a request to 
database to authenticate . 

instead after first request we have to send a token to the client 
and from every next request client makes, it will send only token . and on the server side we donot have to make db call to verify the token authentication
token will also have expiry time 
and even if this token is hacked hacker cannot do anything

creating a new database collection 

create a new file in the models 
    user.model.js

const mongoose = require("mongoose");

const userModel = mongoose.model("User",{
    userName : {type:String, required:[true, "username is required"]},
    password: { type: String, required: [true, "password is required"] },
    lastUpdated:{type: Date , default: Date.now}, // we want to keep track when this info is updated
})


last updated field is important as it will give the details of when was last time data is modified 
for the most of the data will have lastupdated property
there will be also "lastupdatedby" . we will not use  this right now as we donot have users

note here we donot need created date let us go to robo 3T

    db.products.find({})
    var id = ObjectId("5c9b1c06ea0472d9fd4a53ff");
    id.getTimestamp()
    results in ----> ISODate("2019-03-27T06:45:26Z")

this is how we create timestamp . In this example we have primary key created by mongodb . if we have different primary key then we can use that for getting the primary key    


const userModel = mongoose.model("User",{
    userName : {type:String, required:[true, "username is required"]},
    password: { type: String, required: [true, "password is required"] },
    active: {type:Boolean , default:true}, // instead of deleting the user we can keep the acc deactivated 
    locked :{}
    lastUpdated:{type: Date , default: Date.now}, // we want to keep track when this info is updated
})

active:false can be usefull to block the users 
or in some website they send link to verify the emailaddress . In that case we use active as false until user verifies his email address
locked can be usefull for banking databases because they want to block a certain user after 5 wrong attempts 

const userModel = mongoose.model("User",{
    userName : {type:String, required:[true, "username is required"]},
    password: { type: String, required: [true, "password is required"] },
    active: {type:Boolean , default:true},
    lastUpdated:{type: Date , default: Date.now}
})

we can store more information address firstname, lastname etc.

now exports this 
module.exports = userModel;


Now create user.router.js in routes, user.ctrl.js in controllers and in services --> user.svc.js 

============================================
user.router.js ---> code 
++++++++++++++++++++++++++++++++++++++++++++
const express = require('express');
const router  = express.Router();
const userCtrl = require('../controllers/user.ctrl');

router.post('/', userCtrl.register);



===========================================
user.svc.js ---> code 
+++++++++++++++++++++++++++++++++++++++++++
const User = require('../models/user.model');

class UserService{
    register(data){ 
        var user = new User(data);
        return user.save(); // returns a promise
    }
}

module.exports = new UserService();


===========================================
user.model.js --> code 
+++++++++++++++++++++++++++++++++++++++++++

const mongoose = require("mongoose");

const UserModel = mongoose.model("User",{
    userName : {type:String, required:[true, "username is required"]},
    password: { type: String, required: [true, "password is required"] },
    active: {type:Boolean , default:true}, // instead of deleting the user we can keep the acc deactivated 
    lastUpdated:{type: Date , default: Date.now}, // we want to keep track when this info is updated
})

module.exports = UserModel;

index.js --> code 
import user router into index.js file 
app.use('/api/users', userRouter)

from index.js flow goes to 1. user.router.js , 
                            2. user.ctrl.js // handler for the request
                            3. user.svc.js // for connecting to db 
                            4. user.model.js // save the data using mongoose model 

=====================================================================
two bugs for now 
1. password in db is shown in plain text format 
2. i can save the same username and password multiple times 

we shouldnot store the password in plain text it has to be hashed 

lets fix the second bug as it is easy .

users.model.js -> in username add property called unique to be true 

from robo 3t remove the records with this statement db.users.remove({})

unique is not a validation , but it is a contraint in mongodb level , not in mongoose or application 

code --> user.ctrl.js

const userSvc = require('../services/user.svc');
class UserCtrl{
    async register(req, res){
        try{
            await userSvc.register(req.body);
            res.status(200);
            res.send("successfully registered");
        }
        catch(err){
            if (err.errmsg.indexOf("duplicate key error") > -1 ){
                res.status(400);
                res.send("user is already registered");
            }else{
                res.status(500);
                res.send('internal server error');
            }
            
        }
        
    }
}

module.exports = new UserCtrl();


how to fix -->  password 

we have to encrypt the password we use a package called bcrypt npm


explanation 

encryption - decryption
hashing

encrytion can be decrypt 

hashing is done for password once hashing is done string is lost 
eg : hashing abc -> $12FGgh --> we cannot get string value from hashed value
this is the reason why you donot get oldpasword because it is not stored in string format 
its converted 

then how does userverify his password 

abc --> $12FGgh // this hashed password is saved 
next user tries to authenticate 
he sends password 
abc --> $12FGgh // this hashed password is compared with stored hash password 

if it is encryption and decrytion 
abc --> 4$5kd       --->    abc 
        encryption          decrytion from encryted value
adhaar card number is encrypted and stored as it has to be retrieved later


npm install bcrypt

go to user.ctrl.js and import bcrypt

and in register method hash the password that you get as payload 
    let hashedPassword = bcrypt.hashSync(req.body.password)
    req.body.password = hashedPassword; 
    await userSvc.register(req.body);

--------------------------------------------------------------
now authentication 
user.router.js
const router  = express.Router();
router.post('/register',userCtrl.register)
router.post('/login',userCtrl.login) // add this

in user.svc.js define method getUser for fetching the user from database
    getUser(username) {
        return User.findOne({ userName: username }, { _id: 0, password: 1 }).exec();
    }

in user.ctrl.js define a method called login. In this use bcrypt to compare the login password with hashedpassword stored in database
let user = userSvc.getUser(req.body.userName)
let result = bcrypt.compareSync(req.body.password, user.password );
result value will be either true or false 
if it is successfull we have send the token id for the client 
got search for JSON web token in google
npm i jsonwebtoken



