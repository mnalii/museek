const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = chai.expect;

const server = require('../index');

let customerToken;
let musicianToken;

describe('LOGIN', () => {
  it('LOGIN MUSICIAN', done => {
      chai.request(server)
          .post('/api/user/login')
          .send({
              email: 'billie43@gmail.com',
              password: '1234567'
          })
          .end((err, res) => {
              expect(res.status).eql(200);
              musicianToken = res.header.authorization;
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
              customerToken = res.header.authorization;
              done();
          });
  });
});
