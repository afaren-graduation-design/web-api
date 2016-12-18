var logicPuzzle = require('../../models/logic-puzzle');
var userHomeworkQuizzes = require('../../models/user-homework-quizzes');
var constant = require('../../mixin/constant');
var async = require('async');
var deadline = 7;
function getLogicPuzzleStatus(userId, data, done) {
  logicPuzzle.isPaperCommited(userId, data, done);
}

function getHomeworkQuizStatus(userId, data, done) {
  var status = false;
  async.waterfall([
    (done) => {
      userHomeworkQuizzes.findOne({userId: userId}).exec((err, data) => {
        done(err, data);
      });
    },
    (data, done) => {
      var quizzes = data.toJSON().quizzes;
      status = quizzes.every((item) => {
        return item.status === 4;
      }) || quizzes.filter((item, index) => {
        return index > 0;
      }).every(item => (item.status === 1)) && !quizzes[0].startTime;
      done(status, data);
    },
    (data, done) => {
      var currentQuiz = data.toJSON().quizzes.filter((item) => {
        return item.status !== 1 && item.status !== 4;
      })[0];
      var currentTime = parseInt(new Date().getTime()) /
        (constant.time.SECONDS_PER_MINUTE *
        constant.time.MINUTE_PER_HOUR *
        constant.time.HOURS_PER_DAY *
        constant.time.MILLISECOND_PER_SECONDS);
      var startTime = parseInt(currentQuiz.startTime) /
        (constant.time.SECONDS_PER_MINUTE *
        constant.time.MINUTE_PER_HOUR *
        constant.time.HOURS_PER_DAY);
      status = currentTime - startTime > deadline;
      done(status, data);
    }
  ], (err) => {
    if (err) {
      Object.assign(data, {homeworkQuizzesEnabled: false});
      done(null, data);
    } else {
      Object.assign(data, {homeworkQuizzesEnabled: true});
      done(null, data);
    }
  });
}

module.exports = {
  getHomeworkQuizStatus: getHomeworkQuizStatus,
  getLogicPuzzleStatus: getLogicPuzzleStatus
};
