const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server/server');
const {Todo} = require('./../server/models/todo');

beforeEach((done) => {
    Todo.remove({}).then(() => done());
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
            if(err){
                return done(err);
            }

            Todo.find().then((result) => {
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
            if(err){
                return done(err);
            }
            Todo.find().then((result) => {
                expect(result.length).toBe(0);
                done();
            })
            .catch((err) => {
                done(err);
            });
        })
    });
});

