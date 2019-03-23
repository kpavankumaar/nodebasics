class DefaultCtrl{
    get(req,res){
        res.send("express api ");
    }

}
// create a object using a class  
module.exports = new DefaultCtrl();