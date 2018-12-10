const {Todo} = require('./../../server/models/todo');
const {ObjectID} = require('mongodb');
const {User} = require('./../../server/models/user');
const jwt = require('jsonwebtoken');

const todos = [
    {_id: new ObjectID(), text: 'Todo 1', completed: false}, 
    {_id: new ObjectID(), text: 'Todo 2', completed: true}
    ];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
    {
        _id: userOneId,
        email: 'userone@gmail.com',
        password: '123abc!',
        tokens: [{
           access: 'auth',
           token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, 'rocking').toString()
        }]
    },

    {
        _id: userTwoId,
        email: 'usertwo@gmail.com',
        password: 'abc123!'
    }
]

const populateItems = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        //The method insert many here was not used because it wouldn't fire the middleware
        //and consequently save the password without hashing it
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]); //Promise.all awaits the two promises being resolved
    }).then(() => done());
}

module.exports = {
    todos,
    populateItems,
    populateUsers
}