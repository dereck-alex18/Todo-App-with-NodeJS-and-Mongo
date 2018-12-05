const env = process.env.NODE_ENV || 'development';

if(env === 'development'){
    process.env.PORT = 3000;
    process.env.DATABASEURL = 'mongodb://localhost:27017/TodoApp';
}else{
    process.env.PORT = 3000;
    process.env.DATABASEURL = 'mongodb://localhost:27017/TodoAppTest';
}