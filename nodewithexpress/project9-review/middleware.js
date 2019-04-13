const jwt = require("jsonwebtoken");
const config = require("./config")
let middleware = {
    authenticate: function (req,res,next){
                    console.log(req.headers);
                    let base64String = req.headers["authorization"].replace("Basic ","");
                    let decodedString = new Buffer(base64String, 'base64').toString();

                    let tokens = decodedString.split(":");

                    let username = tokens[0];
                    let password = tokens[1];
                    if (username == 'admin' && password == 'password'){
                        next();    
                    }else{
                        res.status(401);
                        res.send('unauthorized')
                    }

                    // next();// means go ahead and it is a function 
                },
    tokenAuth: function (req,res, next){
        let token = req.headers['authorization']
        var result = jwt.verify(token, config.jwtPassword,function(err){
            if (err) {
                res.status(401);
                res.send("Unauthorized");
            }
            else{
                next();
            }
        });
        console.log(result);
        
    }
}
module.exports = middleware;