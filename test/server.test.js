const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server/server');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {populateItems, todos, populateUsers, users} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateItems);

describe('/POST route todo', () => {
    
    it('should create a new todo', (done) => {
        const text = 'Testing the app';
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body).toBeAn('object');
        })
        .end((err, res) => {
            //Verify if the todo was indeed created
            if(err){
                return done(err);
            }

            Todo.find({text}).then((result) => {
                expect(result.length).toBe(1);
                expect(result[0].text).toBe(text);
                done(); 
            })
            .catch((err) => {
                done(err);
            });
            
        });
    });


    it('should create a invalid todo', (done) => {
        
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            //Make sure that the invalid todo was not saved in the DB
            if(err){
                return done(err);
            }
            Todo.find().then((result) => {
                expect(result.length).toBe(2);
                done();
            })
            .catch((err) => {
                done(err);
            });
        })
    });
});


describe('/GET route todo', () => {
    it('should return all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.items.length).toBe(2);
        })
        .end(done);
    });
});

describe('/GET one todo', () => {
    it('should return one todo according to the id', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should expect a 404 status if a todo is not found', (done) => {
        request(app)
        .get('/todos/5c056f87597c90264753a173')
        .expect(404)
        .end(done)
    });

    it('should expect a 400 status if a non-valid id is passed', (done) => {
        request(app)
        .get('/todos/123abc')
        .expect(400)
        .end(done)
    });
});

describe('/DELETE one todo', () => {
    it('should delete one todo according to its id', (done) => {
        const id = todos[0]._id.toHexString();

        request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.findById(id).then((todo) => {
                //Check if the todo was really deleted in DB
                expect(todo).toNotExist();
                done();
            })
            .catch((e) => {
                return done(e);
            });
        });
    
    });

    it('should return a 404 status', (done) => {
        const id = new ObjectID().toHexString();

        request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return a 404 status', (done) => {
        
        request(app)
        .delete(`/todos/abc123`)
        .expect(400)
        .end(done);
    });
});

describe('/PATCH one todo', () => {
    it('should update one todo', (done) => {
        const id = todos[0]._id.toHexString();
        const text = "updated TODO2";
        request(app)
        .patch(`/todos/${id}`)
        .send({completed: true, text})
        .expect(200)
        .expect((res) => {
            expect(res.body.body.text).toBe(text);
            expect(res.body.body.completed).toBe(true);
            expect(res.body.body.completedAt).toBeA('number');
        })
        .end(done);
    });

    it('should update one todo', (done) => {
        const id = todos[0]._id.toHexString();
        const text = "updated TODO2";
        request(app)
        .patch(`/todos/${id}`)
        .send({completed: false, text})
        .expect(200)
        .expect((res) => {
            expect(res.body.body.text).toBe(text);
            expect(res.body.body.completed).toBe(false);
            expect(res.body.body.completedAt).toBe(null);
        })
        .end(done);
    });
});

describe('/GET users/me', () => {
    it('should return an auth user', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.user._id).toBe(users[0]._id.toHexString());
            expect(res.body.user.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return an empty object', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);

    });
});

describe('/POST users', () => {
    it('should create a valid user', (done) => {
        let email = "test@example.com";
        let password = "123abc"; 
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.header['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err, res) => {
            if(err){
                return done(e);
            }
            User.findOne({email}).then((res) => {
                expect(res.email).toBe(email);
                expect(res.password).toNotBe(password);
                done();
            })
            .catch((e) => {
                done(e);
            });
        });
    });

    it('should return a validation error by creating a user with invalid credentials', (done) => {
        let email = "blabla"
        let password = "1233";
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done)
    
    })

    it('should return a validation error by creating an user with an in-use email', (done) => {
        let email = "userone@gmail.com"
        let password = "123456";
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done)
    });
});


