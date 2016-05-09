require('should');
var async = require('async');

require('./spec-base');
var userSession = global.userSession;

describe('/homework/scoring', ()=> {
  it('GET /homework/scoring: should be return my scoring', function (done) {
    userSession
        .get('/homework/scoring')
        .expect(200)
        .expect((res)=> {
          res.body.length.should.equal(1);
          res.body[0].gitRepoUrl.should.equal('http://test.git');
        })
        .end(done)
  });

  it('POST /homework/scoring: should be return 201: ', function (done) {
      userSession
          .post('/homework/scoring')
          .send({
            gitRepoUrl: 'http://test2.git'
          })
          .expect(201)
          .end(done)
  });

  it('PUT /homework/scoring: should be return 200: ', function (done) {
      userSession
          .put('/homework/scoring/572dcf6f041ccfa51fb3f9cb')
          .send({
            status: '3'
          })
          .expect(200)
          .end(done)
  });

  it('PUT /homework/scoring: should be update: ', function (done) {
    function updateScoring(done) {
      userSession
          .put('/homework/scoring/572dcf6f041ccfa51fb3f9cb')
          .send({
            status: '5',
            message: 'Complete!',
          })
          .expect(200)
          .end(done)
    }

    function getScoring(data, done) {
      userSession
          .get('/homework/scoring')
          .expect((res)=> {
            res.body.length.should.equal(1);
            res.body[0].gitRepoUrl.should.equal('http://test.git');
            res.body[0].status.should.equal('5');
            res.body[0].message.should.equal('Complete!');
          })
          .end(done)
    }

    async.waterfall([
      updateScoring,
      getScoring
    ], done)
  });

  it('POST /homework/scoring: should add a scoring', function (done) {

    function createScoring(done) {
      userSession
          .post('/homework/scoring')
          .send({
            gitRepoUrl: 'http://test2.git'
          })
          .end(done)
    }

    function getScoring(data, done) {
      userSession
          .get('/homework/scoring')
          .expect((res)=> {
            res.body.length.should.equal(2);
            res.body[1].gitRepoUrl.should.equal('http://test2.git');
            res.body[1].status.should.equal('3');
            res.body[1].message.should.equal('排队中,请稍候...');
          })
          .end(done)
    }

    async.waterfall([
      createScoring,
      getScoring
    ], done)
  });
});
