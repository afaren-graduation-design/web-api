require('should');
var async = require('async');

require('./spec-base');
var userSession = global.userSession;
var homeworkScoring = require('../../models/homework-scoring');
var userHomeworkQuizzes = require('../../models/user-homework-quizzes');

describe('/homework/scoring', ()=> {
  it('GET /homework/scoring: should be return my scoring', function (done) {
    userSession
        .get('/homework/scoring')
        .expect(200)
        .expect((res)=> {
          res.body.length.should.equal(2);
          res.body[0].userAnswerRepo.should.equal('http://test.git');
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

  it('POST /homework/scoring: should add a scoring', function (done) {

    function createScoring(done) {
      userSession
          .post('/homework/scoring')
          .send({
            userAnswerRepo: 'http://test2.git'
          })
          .end(done)
    }

    function verifyHomeworkScoring(data, done) {
      homeworkScoring.find({}, (err, data)=> {
        data.length.should.equal(3);
        data[2].userAnswerRepo.should.equal('http://test2.git');
        data[2].status.should.equal(3);
        data[2].result.should.equal('排队中,请稍候...');
        done();
      })
    }

    async.waterfall([
      createScoring,
      verifyHomeworkScoring
    ], done)
  });

  it('PUT /homework/scoring: should be update', function (done) {
    function updateScoring(done) {
      userSession
          .put('/homework/scoring/572dcf6f041ccfa51fb3f9cb')
          .send({
            status: 5,
            result: 'Complete!'
          })
          .expect(200)
          .end(done)
    }

    function verifyScoring(data, done) {
      homeworkScoring.find({}, (err, data)=> {
        data.length.should.equal(2);
        data[0].userAnswerRepo.should.equal('http://test.git');
        data[0].status.should.equal(5);
        data[0].result.should.equal('Complete!');
        done(null, null);
      })
    }

    function verifyUserHomeWorkQuiz(data, done) {
      userHomeworkQuizzes
        .findOne({userId: 1})
        .populate({path: 'quizzes.homeworkSubmitPostHistory'})
        .exec((err, data)=> {
          data.quizzes[0].homeworkSubmitPostHistory[0].status.should.equal(5);
          done();
        });
    }

    async.waterfall([
      updateScoring,
      verifyScoring,
      verifyUserHomeWorkQuiz
    ], done)
  });
});