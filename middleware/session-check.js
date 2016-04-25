'use strict';

var getJumpControl = require('../mixin/get-jump-control');
var logicPuzzle = require('../models/logic-puzzle');
var superagent = require('superagent');
var apiRequest = require('../services/api-request');
var yamlConfig = require('node-yaml-config');
var apiServer = yamlConfig.load('./config/config.yml').apiServer;
var async = require('async');

function pathControl(url, data) {
  var target = {};
  var needRedirect = false;
  var jumpControl = getJumpControl(data);

  jumpControl.forEach((item) => {
    if (-1 < item.originPath.indexOf(url) && item.condition) {
      target = item;
      needRedirect = true;
    }
  });

  return {
    needRedirect: needRedirect,
    target: target
  };
}

module.exports = function (req, res, next) {
  var userId;

  if (Boolean(req.session.user)) {
    userId = req.session.user.id;
  }

  async.parallel({
    isLoged: function (done) {
      done(null, Boolean(req.session.user));
    },

    isPaperCommited: function (done) {
      if (!userId) {
        done(null, false);
      } else {
        logicPuzzle.isPaperCommited(userId, (err, data) => {
          done(null, data);
        });
      }
    },

    isDetailed: function (done) {
      if (!userId) {
        done(null, false);
      } else {
        superagent.get(apiServer + 'users/' + userId + '/detail')
            .set('Content-Type', 'application/json')
            .end(function (err) {
              if (err) {
                done(null, false);
              } else {
                done(null, true);
              }
            });
      }
    },

    isAgreed: function (done) {
      logicPuzzle.isDealAgree(userId, (data) => {
        done(null, data);
      });
    },

    isThirdParty: function (done) {
      done(null, Boolean(req.session.passport));
    },

    isAdmin: function (done) {
      if (req.session.user) {
        done(null, req.session.user.role === '9');
      } else {
        done(null, false);
      }
    }

  }, function (err, data) {
    var target = pathControl(req.url, data);
    if (target.needRedirect) {
      res.status(target.head || 403).send(target.body || "");
    } else {
      next();
    }
  });
};