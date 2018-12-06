const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

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

UserSchema.methods.toJSON = function() {
    
    let user = this.toObject()
    let userObj = {_id: user._id, email: user.email};
    return userObj;
}

UserSchema.methods.generateAuthToken = function() {
    
    return new Promise((resolve, reject) => {

        let user = this;
        let access = 'auth';
        let token = jwt.sign({_id: user._id.toHexString(), access}, 'rocking').toString();
        
        resolve({token, access});
    });
}

let User = mongoose.model('User', UserSchema);


module.exports = {
    User
}