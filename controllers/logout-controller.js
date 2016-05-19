'use strict';
var apiRequest = require('../services/api-request');
var async = require('async');

function LogoutController () {

}

LogoutController.prototype.logout = (req, res, next) => {
  var logoutUri = 'logout';

  if (!req.session.user) {
    res.end();
    return;
  }

  var body = {
    userId: req.session.user.id
  };

  async.waterfall([
    (done) => {
      req.session.destroy(function (err) {
        if (err) {
          done(err, null);
        } else {
          done(null, null);
        }
      });
    }, (data, done) => {
      apiRequest.post(logoutUri, body, function (err, resp) {
        done(err, resp);
      });
    }
  ], (err, data) => {
    if (data) {
      res.end();
    } else {
      return next(err);
    }
  });
};

module.exports = LogoutController;
