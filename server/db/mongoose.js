const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect('mongodb://alexport:todosAPI18@ds119663.mlab.com:19663/todos');

module.exports = {
    mongoose
}