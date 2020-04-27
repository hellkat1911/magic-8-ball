const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');

chai.use(chaiHttp);

describe('History', () => {

  // test GET history
  describe('/GET history', () => {
    it('it should GET all saved history entries', (done) => {
      chai.request(server)
        .get('/api/history')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('data');
          res.body.should.have.property('error');
          done();
        });
    });
  });

  // test POST history
  describe('/POST history', () => {
    it('it should accept an object with a data array', (done) => {
      let history = {
        data: ['affirmative', 'neutral', 'contrary']
      };

      chai.request(server)
        .post('/api/history')
        .send(history)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('data');
          res.body.should.have.property('error');
          res.body.data.should.have.lengthOf(history.data.length);
          done();
        });
    });

    it('it should fail for other data types', (done) => {
      let history = 'failure';

      chai.request(server)
        .post('/api/history')
        .send(history)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('data');
          res.body.should.have.property('error');
          res.body.error.should.be.a('string');
          done();
        });
    });
  });

  // test DELETE history
  describe('/DELETE history', () => {
    it('it should DELETE all saved history entries', (done) => {
      chai.request(server)
        .delete('/api/history')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('data');
          res.body.should.have.property('error');
          res.body.data.should.have.lengthOf(0);
          done();
        });
    });
  });
});