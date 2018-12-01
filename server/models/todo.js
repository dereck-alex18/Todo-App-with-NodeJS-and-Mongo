const mongoose = require('mongoose');

let Todo = mongoose.model('Todo', {
        text: {
            type: String,
            required: [true, 'Add something'],
            trim: true,
            minlength: 1
    
        },
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: {
            type: Number,
            default: null
        } 
    });

module.exports = {
    Todo
}