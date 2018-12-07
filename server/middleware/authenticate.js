let {User} = require('./../models/user');

//This is the middleware to check if the user is authenticated
let authenticate = (req, res, next) => {
    let token = req.header('x-auth');
    //Take the token in the header and try to find the user by its token
    User.findByToken(token)
    .then((user) => {
        if(!user){
            //If no user is returned, reject the promise
            return Promise.reject();
        }
        //If the user is found, set the user and the token
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        //In case of error, send 401 status which is unauthorized
        res.status(401).send(e);
    });
};

module.exports = {
    authenticate
}