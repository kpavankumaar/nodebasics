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
                }
}
module.exports = middleware;