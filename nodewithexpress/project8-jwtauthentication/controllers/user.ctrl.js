const userSvc = require('../services/user.svc');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserCtrl{
    async register(req, res){
        try{
            let hashedPassword = bcrypt.hashSync(req.body.password,2);
            req.body.password = hashedPassword; 
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
    async login(req,res){
        let user = await userSvc.getUser(req.body.userName);
        let result = bcrypt.compareSync(req.body.password, user.password)
        console.log(result);
        if(result){
            var token = jwt.sign({},"secret")
            let response = {
                username: req.body.userName,
                token:token
            }
            res.status(200);
            res.json(response);
        }else{
            res.status(401)
            res.send('unauthorized')
        }
        res.status(200);
        res.send(user);
    } 
    
}

module.exports = new UserCtrl();