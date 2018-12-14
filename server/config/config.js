//This file will set all the environment variables the db url, the port as well as tje JWT secret

const env = process.env.NODE_ENV || 'development';


if(env === 'development' || env === 'test'){
    const config = require('./config.json');
    //Setting the environment variables
    let configEnv =  config[env]; //configEnv depends on the env value
    //Object.keys converts the keys of an object into an array
    Object.keys(configEnv).forEach((key) => {
        //Creates the environment variables from config.json
        process.env[key] = configEnv[key];
       
    })
    
    // process.env.PORT = config[env].PORT;
    // process.env.DATABASEURL = config[env].DATABASEURL;
}

