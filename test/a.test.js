const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = chai.expect;

const server = require('../index');
const User = require('../models/User')
const Event = require('../models/Event');

describe('USER', () => {
    before(done => {
        User.deleteMany({}, (err) => {
            done()
        })
    })

    describe('POST', () => {
        it('ADD CUSTOMER USER', done => {
         chai.request(server)
            .post('/api/user/register')
            .send({
                name: 'Muhammad Nur Ali',
                email: 'muh.nurali43@gmail.com',
                password: '1234567',
                role: 'customer'
            })
            .end((err, res) => {
                // console.log(res.body)
                expect(res.status).eql(201)
                done()
            })
        })
        it('ADD MUSICIAN USER', done => {
            chai.request(server)
               .post('/api/user/register')
               .send({
                   name: 'Billie Joy',
                   email: 'billie43@gmail.com',
                   password: '1234567',
                   role: 'musician'
               })
               .end((err, res) => {
                //    console.log(res.body)
                   expect(res.status).eql(201)
                   done()
               })
        })
        it('FAILED ADD USER WITH EXIST EMAIL', done => {
        chai.request(server)
            .post('/api/user/register')
            .send({
                name: 'Muhammad Nur Ali',
                email: 'muh.nurali43@gmail.com',
                password: '1234567',
                role: 'customer'
            })
            .end((err, res) => {
                // console.log(res.body)
                expect(res.status).eql(400)
                done()
            })
        })
        it('FAILED WITH INVALID EMAIL', done => {
            chai.request(server)
                .post('/api/user/register')
                .send({
                    name: 'Muhammad Nur Ali',
                    email: 'muh.nurali43gmail.com',
                    password: '1234567',
                    role: 'customer'
                })
                .end((err, res) => {
                    // console.log(res.body)
                    expect(res.status).eql(400)
                    done()
                })
        })
        it('LOGIN CUSTOMER', done => {
            chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'muh.nurali43@gmail.com',
                    password: '1234567'
                })
                .end((err, res) => {
                    expect(res.status).eql(200);
                    done();
                });
        });
        it('LOGIN MUSICIAN', done => {
            chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'billie43@gmail.com',
                    password: '1234567'
                })
                .end((err, res) => {
                    expect(res.status).eql(200);
                    done();
                });
        });
        it('FAILED LOGIN WITH INVALID CREDENTIALS', done => {
            chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'muh.nurali43@gmail.com',
                    password: '1111111'
                })
                .end((err, res) => {
                    expect(res.status).eql(400);
                    done();
                });
        });
    })
    describe('GET', () => {
        it('GET ALL USER', done => {
            chai.request(server)
                .get('/api/user')
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body.length).eql(2);
                    done();
                });
        })
    });
})

describe('EVENT', () => {
    before(done => {
        Event.deleteMany({}, err => {
            done();
        });
    });


    it('TEST EVENT ENDPOINT', done => {
        chai.request(server)
            .get('/api/event')
            .end((err, res) => {
                expect(res.status).eql(200);
                done();
            });
    });
});
