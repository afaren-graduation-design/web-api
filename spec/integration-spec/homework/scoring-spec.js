'use strict';

require('should');
var async = require('async');
var mongoose = require('mongoose');
var homeworkScoring = require('../../../models/homework-scoring');
var userHomeworkQuizzes = require('../../../models/user-homework-quizzes');

require('../spec-base');
var userSession = global.userSession;

describe('/homework/scoring', ()=> {

  it('Get /homework/quiz/1 should return homework detail', function(done) {
    userSession
        .get('/homework/quizzes/1?paperId=2')
        .expect(200)
        .end(done)
  });

  it('Post /homework/scoring: should create a homeworkScoring record', function (done) {

    var sendPostRequest = (done)=> {
      userSession
          .post('/homework/scoring')
          .expect(201)
          .send({
            quizId: 1,
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
        data[2].startTime.should.equal(2345678);
        done(null, null);
      })
    };

    var verifyUserHomeworkQuizzes = (data, done)=> {
      userHomeworkQuizzes.findOne({userId: 1, paperId: 1}, function(err, data) {
        data.quizzes[0].homeworkSubmitPostHistory.length.should.equal(2);

        done(null, null);
      })
    };

    async.waterfall([
      sendPostRequest,
      verifyHomeworkScoring,
      verifyUserHomeworkQuizzes
    ], done)

  });

  it('Put /homework/scoring/:id should update a homeworkScoring record', function (done) {

    var sendPutRequest = (done)=> {
      userSession
          .put('/homework/scoring/572dcf6f041ccfa51fb3f9cb')
          .send({
            result: "T0sh",
            status: 4
          })
          .expect(200)
          .end(done)
    };

    var verifyHomework = (data, done)=> {
      homeworkScoring.findById('572dcf6f041ccfa51fb3f9cb', function(err, data) {
        data.result.should.equal('OK!');
        data.status.should.equal(4);
        done(err, null);
      });
    };

    var verifyUserHomeworkQuizzes = (data, done)=> {
      var id = new mongoose.Types.ObjectId('572dcf6f041ccfa51fb3f9cb');
      userHomeworkQuizzes
          .aggregate([
            {'$unwind': '$quizzes'},
            {'$unwind': '$quizzes.homeworkSubmitPostHistory'}
          ])
          .match({'quizzes.homeworkSubmitPostHistory': id})
          .exec((err, docs)=> {
            docs[0].quizzes.status.should.equal(4);
            done(null,null);
          })
    };

    var verifyNextQuizzesChanged = (data, done)=> {
      userHomeworkQuizzes.find({}, function(err, docs) {
        docs[0].quizzes[1].status.should.equal(2);
      })
    };

    async.waterfall([
      sendPutRequest,
      verifyHomework,
      verifyUserHomeworkQuizzes
    ], done)

  });
});
