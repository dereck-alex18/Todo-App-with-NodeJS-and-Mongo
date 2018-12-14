require('./config/config');
const mongoose = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');
const {ObjectID} = require('mongodb');
const {authenticate} = require('./middleware/authenticate');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());

//Fetch all TODOS in the database
app.get('/todos', authenticate, (req, res) => {
  
    Todo.find({_creator: req.user.id}).then((items) => {
        res.send({items});
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});


//This route handles creating a new to todo and save it in the database
app.post('/todos', authenticate, (req, res) => {
    let newTodo = new Todo({
        text: req.body.text,
        _creator: req.user.id
    });
    newTodo.save().then((result) => {
        res.send(result);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

//This route get only one todo according to the id passed in the url
app.get('/todos/:id', authenticate, (req, res) => {
    Todo.findOne({_id: req.params.id, _creator: req.user.id}).then((todo) => {
        
        if(!(ObjectID.isValid(req.params.id))){
            res.status(404).send();
        }

        if(!todo){
            res.status(404).send();
        }
        res.send({todo});
        console.log(todo);
    }).catch((e) => {
        console.log(e);
        res.status(400).send('');
    });
});


//This route delete one element by its id
app.delete('/todos/:id', authenticate, (req, res) => {
    
    Todo.findOneAndRemove({_id: req.params.id, _creator: req.user.id}).then((todo) => {
        
        if(!(ObjectID.isValid(req.params.id))){
            return res.status(404).send();
        }
        
        if(todo === null){
           return res.status(404).send();
        }
        
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });

});

//This route deal with updating a todo
app.patch('/todos/:id', authenticate, (req, res) => {
    const body = {text: req.body.text, completed: req.body.completed};
    const _id = req.params.id;

    if(typeof body.completed === "boolean" && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id, _creator: req.user.id}, {$set: body}, {$new: true})
    .then((todo) => {
        if(!(ObjectID.isValid(req.params.id))){
            return res.status(404).send();
        }

        if(!todo){
            res.status(404).send();
        }

        res.send({body});    
    })
    .catch((e) => {
        res.status(400).send();
    });
    
    
});

//This route creates a new user
app.post('/users', (req, res) => {
    
    //Get the email and password sent by the user
    const user = {email: req.body.email, password: req.body.password};
    let newUser = new User(user);

    newUser.generateAuthToken()
    .then((result) => {
        //Generate a new token and insert it inside of tokens array in User document   
        newUser.tokens = newUser.tokens.concat([result]);

        newUser.save()
        //Save the user and send the newly created token in the header
        .then((user) => {
            res.header('x-auth', result.token).send(user);
        })
        .catch((e) => {
        //If there is an error as far as saving 400 will be sent
            res.status(400).send(e);
        });
    }).catch((e) => {
        //If there is an error as far as creating the token 400 will be sent
        res.status(400).send(e);
    });

});


//This route get the user
app.get('/users/me', authenticate, (req, res) => {
    const user = req.user;
    res.send({user});
});

//This route is responsible for logging in an user
app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    //Find the user by its credentials
    User.findByCredentials(email, password).then((user) => {
        //Create a new token for the user and send it
        user.generateAuthToken().then((result) => {
            //add the newly created token to tokens array in the User document
            user.tokens =  user.tokens.concat([result]);
            //Save the new token
            user.save().then((user) => { 
                //Send the token and the user itself
                res.header('x-auth', result.token).send(user);
                
            })
            .catch((e) => {
                res.status(400).send();
            });
        })
        .catch((e) => {
            res.status(400).send();
        })
    })
    .catch((e) => {
        res.status(400).send();
    });
});

//This route is responsible for deleting the current used token
app.delete('/users/me/token', authenticate, (req, res) => {
    //The middleware check if the user is logged in
    req.user.removeToken(req.token).then(() => {
        //if so, the token is removed
        res.status(200).send();
    })
    .catch(() => {
        res.status(401).send();
    })
});


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started at port: ${port}`);
});

module.exports = {app};


