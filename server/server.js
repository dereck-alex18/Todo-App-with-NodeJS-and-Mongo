const mongoose = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
    let todosArr = [];
    Todo.find().then((items) => {
        res.send({items});
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

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

app.listen(3000, () => {
    console.log('Server was started on port 3000...');
});

module.exports = {app};


