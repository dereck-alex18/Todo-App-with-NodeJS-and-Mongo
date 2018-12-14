This project is a complete JSON TODO API where the user is able to create, read, update and delete (CRUD) todos. 
The first thing the user needs to do is to create a new account then the API will return a new token in the header. To create, read, update or delete, the user has to send this token in the header along with the data in the body, otherwise the operation will not be succeeded. When logged out, the token is destroyed and to get a new one is necessary logging in.

This porject was built with different kinds of technology such as NODEJS as the server language, MongoDB for the data base, JWT as the library to create and validate the tokens, bcrypt to hash and salt the password. Mocha, Supertest and expect were used to test the application automatically as well as Postman was used to test it manually.

The API is hosted on: url=https://whispering-mountain-12817.herokuapp.com/

The following are examples on how to use the api (most of the routes are private (except login and sign up routes), then makesure to send the user's token in the header):


-POST to create a new user:

    url/users

    then just set the body:
    {
        "email": example@example.com,
        "password": "123456"
    }

    The password have to have a min length of 6 chars

-POST to login an user:
    url/users/login

    then just set the body:

    {
        "email": "example@example.com",
        "password": "123456"
    }

-DELETE to logout:
    url/users/me/token

-GET all todos.

    url/todos

-GET one todo:

    url/todos/:id (:id ==> is the id of the todo)

-POST to create a todo:

    url/todos

    then just set the body:

    {
        "text": "A new todo"
    }

-PATCH to update a todo:

    url/todos/:id (:id ==> is the id of the todo)

    then to update a todo just send the body:
    {
        "text": "Updated todo",
        "completed": true
    }

-DELETE to delete a todo:

    url/delete/:id (:id ==> is the id of the todo)


