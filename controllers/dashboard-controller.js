'use strict';
var logicPuzzle = require('../models/logic-puzzle');
var constant = require('../mixin/constant');
var async = require('async');
var userHomeworkQuizzes = require('../models/user-homework-quizzes');
var apiRequest = require('../services/api-request');
var deadline = 7;
function DashboardController() {

}

function checkDetail(userDetatil) {
  for (var member in userDetatil) {
    if (userDetatil[member] === null) {
      return false;
    }
  }
  return true;
}

DashboardController.prototype.isCommited = (req, res) => {
  var userId = req.session.user.id;
  var isPaperCommited, isOverTime, isFinished, isFinishedDetail;
  async.waterfall([
    (done) => {
      logicPuzzle.isPaperCommited(userId, done);
    },
    (data, done) => {
      isPaperCommited = data;
      userHomeworkQuizzes.findOne({userId: userId}, done);
    },
    (data, done) => {
      var currentQuiz = data.quizzes.filter((quiz) => {
        return quiz.status !== constant.homeworkQuizzesStatus.LOCKED &&
            quiz.status !== constant.homeworkQuizzesStatus.SUCCESS;
      })[0];
      if (currentQuiz) {
        var currentTime = parseInt(new Date().getTime()) /
            (constant.time.SECONDS_PER_MINUTE *
            constant.time.MINUTE_PER_HOUR *
            constant.time.HOURS_PER_DAY *
            constant.time.MILLISECOND_PER_SECONDS);
        var startTime = parseInt(currentQuiz.startTime) /
            (constant.time.SECONDS_PER_MINUTE *
            constant.time.MINUTE_PER_HOUR *
            constant.time.HOURS_PER_DAY);

        isOverTime = parseInt(currentTime - startTime) > deadline;
      } else {
        isOverTime = false;
      }
      isFinished = data.quizzes.filter((quiz) => {
        return quiz.status !== constant.homeworkQuizzesStatus.SUCCESS;
      }).length === 0;
      done(null, null);
    }, (data, done) => {
      apiRequest.get('users/' + userId + '/detail', (err, res, next) => {
        if (err && res.statusCode !== 404) {
          return next(err);
        }
        isFinishedDetail = res.statusCode === 404 ? false : checkDetail(res.body);
        done(null, null);
      });
    }], (err) => {
    if (err) {
      res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
    } else {
      res.send({
        isPaperCommited: isPaperCommited,
        isOverTime: isOverTime,
        isFinished: isFinished,
        isFinishedDetail: isFinishedDetail
      });
    }
  });
};

module.exports = DashboardController;
