'use strict';
var constant = require('../mixin/constant');
var async = require('async');
var apiRequest = require('../services/api-request');
var dashboardService = require('../services/dashboard/dashboard-service');
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
  var data = {};
  async.waterfall([
    (done) => {
      apiRequest.get('users/' + userId + '/detail', (err, res, next) => {
        if (err && res.statusCode !== 404) {
          return next(err);
        }
        data.isFinishedDetail = res.statusCode === 404 ? false : checkDetail(res.body);
        done(null, data);
      });
    },
    (data, done) => {
      dashboardService.getLogicPuzzleStatus(userId, data, done);
    },
    (data, done) => {
      dashboardService.getHomeworkQuizStatus(userId, data, done);
    }
  ], (err, data) => {
    if (err) {
      res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
    } else {
      res.send(data);
    }
  });
};

module.exports = DashboardController;
