const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server/server');
const {Todo} = require('./../server/models/todo');

const todos = [{_id: new ObjectID(), text: 'Todo 1'}, {_id: new ObjectID(), text: 'Todo 2'}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

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


