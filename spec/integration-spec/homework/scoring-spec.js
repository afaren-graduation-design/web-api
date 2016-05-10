require('should');
var async = require('async');
var homeworkScoring = require('../../../models/homework-scoring');
var userHomeworkQuizzes = require('../../../models/user-homework-quizzes');

require('../spec-base');
var userSession = global.userSession;

describe('/homework/scoring', ()=> {

  it('Post /homework/scoring: should create a homeworkScoring record', function (done) {

    var sendPostRequest = (done)=> {
      userSession
          .post('/homework/scoring')
          .send({
            homeworkQuizUri: 'homeworkQuizzes/1',
            userAnswerRepo: 'http://test.git',
            paperId: 1
          })
          .end(done)
    };

    var verifyHomeworkScoring = (data, done)=> {
      homeworkScoring.find({}, function(err, data) {
        data.length.should.equal(3);
        data[2].userAnswerRepo.should.equal("http://test.git");

        done(null, null);
      })
    };

    var verifyUserHomeworkQuizzes = (data, done)=> {
      userHomeworkQuizzes.findOne({userId: 1, paperId: 1}, function(err, data) {
        data.quizzes[0].homeworkSubmitPostHistory.length.should.equal(1);

        done(null, null);
      })
    };

    async.waterfall([
      sendPostRequest,
      verifyHomeworkScoring,
      verifyUserHomeworkQuizzes
    ], done)

  });
});
