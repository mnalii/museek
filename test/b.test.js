const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = chai.expect;

const server = require('../index');

let customerToken;
let musicianToken;
let musicianId;
let eventId;
let favoriteId;

describe('USER', () => {
    it('LOGIN MUSICIAN', done => {
        chai.request(server)
            .post('/api/user/login')
            .send({
                email: 'billie43@gmail.com',
                password: '1234567'
            })
            .end((err, res) => {
                expect(res.status).eql(200);
                musicianToken = res.body.token;
                done();
            });
    });
    it('LOGIN CUSTOMER', done => {
        chai.request(server)
            .post('/api/user/login')
            .send({
                email: 'muh.nurali43@gmail.com',
                password: '1234567'
            })
            .end((err, res) => {
                expect(res.status).eql(200);
                customerToken = res.body.token;
                done();
            });
    });
    it('LOGIN CUSTOMER', done => {
        chai.request(server)
            .get('/api/user/')
            .end((err, res) => {
                expect(res.status).eql(200);
                musicianId = res.body[1]._id;
                done();
            });
    });
});

describe('EVENT', () => {
    it('CUSTOMER ADD EVENT', done => {
        chai.request(server)
            .post('/api/event')
            .send({
                category: 'Acoustic',
                musicianId,
                dateEvent: new Date(),
                duration: 3600000,
                location: 'Batam'
            })
            .set('Authorization', customerToken)
            .end((err, res) => {
                expect(res.status).eql(201);
                done();
            });
    });
    it('CUSTOMER ADD EVENT', done => {
        chai.request(server)
            .post('/api/event')
            .send({
                category: 'Jazz',
                musicianId,
                dateEvent: new Date(),
                duration: 3600000,
                location: 'Batam'
            })
            .set('Authorization', customerToken)
            .end((err, res) => {
                expect(res.status).eql(201);
                done();
            });
    });
    it('MUSICIAN CAN\'T ADD EVENT', done => {
        chai.request(server)
            .post('/api/event')
            .send({
                category: 'Acoustic',
                musicianId,
                dateEvent: new Date(),
                duration: 3600000,
                location: 'Batam'
            })
            .set('Authorization', musicianToken)
            .end((err, res) => {
                expect(res.status).eql(401);
                done();
            });
    });
    it('ANONYMOUSE CAN\'T ADD EVENT', done => {
        chai.request(server)
            .post('/api/event')
            .send({
                category: 'Acoustic',
                musicianId,
                dateEvent: new Date(),
                duration: 3600000,
                location: 'Batam'
            })
            .end((err, res) => {
                expect(res.status).eql(401);
                done();
            });
    });
    it('RETURN 2 EVENT', done => {
        chai.request(server)
            .get('/api/event')
            .end((err, res) => {
                expect(res.body.length).eql(2);
                eventId = res.body.data[0]._id;
                done();
            });
    });
    it('RETURN EVENT DETAIL', done => {
        chai.request(server)
            .get(`/api/event/${eventId}`)
            .end((err, res) => {
                expect(res.status).eql(200);
                done();
            });
    });
    it('DELETE ONE EVENT', done => {
        chai.request(server)
            .delete(`/api/event/${eventId}`)
            .set('Authorization', customerToken)
            .end((err, res) => {
                expect(res.status).eql(200);
                done();
            });
    });
    it('RETURN 1 EVENT', done => {
        chai.request(server)
            .get('/api/event')
            .end((err, res) => {
                expect(res.body.length).eql(1);
                eventId = res.body.data[0]._id;
                done();
            });
    });
    it('UPDATE 1 EVENT', done => {
        chai.request(server)
            .put(`/api/event/${eventId}`)
            .send({
                duration: 1800000
            })
            .set('Authorization', customerToken)
            .end((err, res) => {
                expect(res.status).eql(200);
                done();
            });
    });
    it('CHECK UPDATED EVENT', done => {
        chai.request(server)
            .get('/api/event')
            .end((err, res) => {
                expect(res.body.length).eql(1);
                done();
            });
    });
});

describe('FAVORITE', () => {
    it('GET CUSTOMER FAVORITE WITH 0 DATA', done => {
        chai.request(server)
            .get('/api/favorite')
            .set('Authorization', customerToken)
            .end((err, res) => {
                expect(res.status).eql(200);
                expect(res.body.length).eql(0);
                done();
            });
    });
    it('ADD MUSICIAN TO CUSTOMER FAVORITE', done => {
        chai.request(server)
            .post('/api/favorite')
            .set('Authorization', customerToken)
            .send({
                musicianId
            })
            .end((err, res) => {
                expect(res.status).eql(201);
                done();
            });
    });
    it('GET CUSTOMER FAVORITE WITH 1 DATA', done => {
        chai.request(server)
            .get('/api/favorite')
            .set('Authorization', customerToken)
            .end((err, res) => {
                expect(res.status).eql(200);
                expect(res.body.length).eql(1);
                favoriteId = res.body.data[0]._id;
                done();
            });
    });
    it('GET FAVORITE DETAIL', done => {
        chai.request(server)
            .get(`/api/favorite/${favoriteId}`)
            .set('Authorization', customerToken)
            .end((err, res) => {
                expect(res.status).eql(200);
                done();
            });
    });
    it('DELETE FAVORITE ', done => {
        chai.request(server)
            .delete(`/api/favorite/${favoriteId}`)
            .set('Authorization', customerToken)
            .end((err, res) => {
                expect(res.status).eql(200);
                done();
            });
    });
    it('GET CUSTOMER FAVORITE WITH 0 DATA', done => {
        chai.request(server)
            .get('/api/favorite')
            .set('Authorization', customerToken)
            .end((err, res) => {
                expect(res.status).eql(200);
                expect(res.body.length).eql(0);
                done();
            });
    });
});
