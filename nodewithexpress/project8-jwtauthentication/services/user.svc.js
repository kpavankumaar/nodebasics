const User = require('../models/user.model');

class UserService{
    register(data){ 
        var user = new User(data);
        return user.save();
    }
    getUser(username) {
        return User.findOne({ userName: username }, { _id: 0, password: 1 }).exec();
    }
}

module.exports = new UserService();
