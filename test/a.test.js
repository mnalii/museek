const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = chai.expect;

const server = require('../index');
const Event = require('../models/Event');

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
