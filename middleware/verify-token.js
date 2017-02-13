'use strict';
var Token = require('../models/token');
// var constant = require('../mixin/constant');
var async = require('async');
var authorityCtrl = require('../mixin/authority-controller');

function getType(o) {
  var typeStr = Object.prototype.toString.call(o).slice(8, -1);
  return typeStr;
}

function matchUrl(url, patterns) {
  return patterns.some((pattern) => {
    if (getType(pattern) === 'RegExp') {
      return pattern.test(url);
    } else {
      return url.indexOf(pattern) > -1;
    }
  });
}

module.exports = (req, res, next) => {
  if (['/register', '/login'].indexOf(req.url) !== -1) {
    return next();
  }
  const uuid = req.cookies.uuid;
  const url = req.url;
  async.waterfall([
    (done) => {
      Token.findOne({uuid}, (err, user) => {
        if (err || !user) {
          return done('401', null);
        }
        done(null, null);
      });
    },
    (data, done) => {
      let authorityControl = authorityCtrl();
      authorityControl.forEach((item) => {
        if (matchUrl(url, item.originPath)) {
          return done(null, item);
        }
      });
      done(null, null);
    },
    (item, done) => {
      if (item) {
        return  item.role.indexOf(req.session.user.role) > -1 ? done(null, null) : done('403', null);
      }
      done(null, null);
    }
  ], (err) => {
    if (err === '401') {
      return res.sendStatus(401);
    }

    if (err === '403') {
      return res.sendStatus(403);
    }
    if (err) {
      return next(err);
    }

    return next();
  });
};
