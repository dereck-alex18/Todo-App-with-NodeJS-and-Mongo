const mongoose = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//Fetch all TODOS in the database
app.get('/todos', (req, res) => {
  
    Todo.find().then((items) => {
        res.send({items});
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});


//This route handles creating a new to todo and save it in the database
app.post('/todos', (req, res) => {
    let newTodo = new Todo({
        text: req.body.text
    });
    newTodo.save().then((result) => {
        res.send(result);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

//This route get only one todo according to the id passed in the url
app.get('/todos/:id', (req, res) => {
    Todo.findById(req.params.id).then((todo) => {
        
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
app.delete('/todos/:id', (req, res) => {
    
    
    Todo.findByIdAndRemove(req.params.id).then((todo) => {
        
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

app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});

module.exports = {app};


