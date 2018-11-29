const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// let Todo = mongoose.model('Todo', {
//     text: {
//         type: String,
//         required: [true, 'Add something'],
//         trim: true,
//         minlength: 1

//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     completedAt: {
//         type: Number,
//         default: null
//     } 
// });

// let newTodo = new Todo({text: "do something"});

// newTodo.save().then((result) => {
//     console.log(result);
// })
// .catch((err) => {
//     console.log('smth went wrong!', err);
// });

let User = mongoose.model('User', {
    email:{
        type: String,
        minlength: 1,
        required: true,
        trim: true
    }
});

let newUser = new User({email: "dereck_alexander@gmail.com"})

newUser.save().then((result) => {
    console.log(result);
})
.catch((err) => {
    console.log(err);
});