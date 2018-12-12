const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
        email:{
            type: String,
            minlength: 1,
            required: true,
            trim: true,
            unique: true,
            validate: {
                validator: (value) => {
                    return validator.isEmail(value);
                },
                message: '{VALUE} is not a valid email'
            }
        },
    
        password: {
            type: String,
            require: true,
            minlength: 6
        },
        tokens: [{
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
        ]
    });

//The method bellow is responsible for returning only the user's id and email
//To avoid the user seeing another informations such as the token
UserSchema.methods.toJSON = function() {
    
    let user = this.toObject()
    let userObj = {_id: user._id, email: user.email};
    return userObj;
}

UserSchema.methods.removeToken = function(token){
    const user = this;
//Remove the token from the tokens array
//It returns a promise that will be handled in server.js
   return user.update({
        $pull: { 
            tokens:{
                token
            }
        }
    });
};

//This method is responsible for creating the token. It returns a promise
//Where can be accessed in server.js
UserSchema.methods.generateAuthToken = function() {
    
    return new Promise((resolve, reject) => {

        let user = this;
        let access = 'auth';
        let token = jwt.sign({_id: user._id.toHexString(), access}, 'rocking').toString();
        
        resolve({token, access});
    });
}

//This method is responsible for finding an user by its token,
//If the token is invalid it rejects the promise, otherwise it returns User.findOne which
//return a promise
UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try{
        decoded = jwt.verify(token, 'rocking');
    }catch(e){
        return Promise.reject(e);
    }
   
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

//This method find an user by its credentials and return a promise
UserSchema.statics.findByCredentials = function(email, password){
    const User = this;
    
    return User.findOne({email}).then((user) => {
        //If there is no user it rejects the promise
        if(!user){
            return Promise.reject()
        }
        //Otherwise it returns a new promise cheking if the password sent by the user
        //is the same as the one on database. If so, the promise will be resolved
        //The promise is handled in server.js
        return new Promise((resolve, reject) => {
            
            bcrypt.compare(password, user.password, (err, res) => {
                if(err){
                    reject(err);
                }
                if(res){
                   resolve(user);
                }else{
                    reject();
                }
            })
         });
    });
}

//This is a middleware that will be executed before the password being saved to the database
//It checks if the password was modified, if so it will be hashed and saved to db.
 UserSchema.pre('save', function(next){
    const user = this;

    if(user.isModified('password')){
    //Check if the pass was changed    
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next(); //next() goes inside of the callback, otherwise the middleware will not be finished
            });
        });
        
    }else{
        next();
    }
});

let User = mongoose.model('User', UserSchema);


module.exports = {
    User
}