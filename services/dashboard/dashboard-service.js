var logicPuzzle = require('../../models/logic-puzzle');
var userHomeworkQuizzes = require('../../models/user-homework-quizzes');
var constant = require('../../mixin/constant');
var async = require('async');
var deadline = 7;
function getLogicPuzzleStatus(id, allData, index, callback) {
  logicPuzzle.isPaperCommited(id, allData, index, callback);
}

function getHomeworkQuizStatus(id, allData, index, callback) {
  var status = false;
  async.waterfall([
    (done) => {
      userHomeworkQuizzes.findOne({_id: id}).exec((err, data) => {
        if (err) {
          throw err;
        } else {
          if (!data) {
            done(true, data);
          }
          done(null, data);
        }
      });
    },
    (data, done) => {
      if (allData[index - 1].type === 'logicQuizzes') {
        done(null, data, allData[index - 1].status);
      }
      if (allData[index - 1].type === 'homeworkQuizzes') {
        userHomeworkQuizzes.findOne({_id: allData[index - 1].id}, (err, doc) => {
          if (err) {
            throw err;
          }
          let quizzes = doc.toJSON().quizzes;
          if (quizzes[quizzes.length - 1] === 4) {
            done(null, data, false);
          } else {
            done(null, data, true);
          }
        });
      }
    },
    (data, isCommited, done) => {
      var quizzes = data.toJSON().quizzes;
      status = quizzes.every((item) => {
        return item.status === 4;
      }) || quizzes.filter((item, index) => {
        return index > 0;
      }).every(item => (item.status === 1)) && !quizzes[0].startTime && isCommited;
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
      allData[index].status = false;
      callback(null);
    } else {
      allData[index].status = true;
      callback(null);
    }
  });
}

module.exports = {
  getHomeworkQuizStatus: getHomeworkQuizStatus,
  getLogicPuzzleStatus: getLogicPuzzleStatus
};
