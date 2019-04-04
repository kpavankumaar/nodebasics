class DefaultCtrl{
    get(req,res){
        res.send("express api ");
    }
    health(req,res){

    }

}
// create a object using a class  
module.exports = new DefaultCtrl();