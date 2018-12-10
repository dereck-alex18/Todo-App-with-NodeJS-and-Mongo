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

UserSchema.pre('save', function(next){
    const user = this;

    if(user.isModified('password')){
        
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                console.log(user.password);
                next();
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