'use strict';

var constant = require('../mixin/constant');
var md5 = require('js-md5');
var validate = require('validate.js');
var constraint = require('../mixin/login-constraint');
var apiRequest = require('../services/api-request');
var async = require('async');
var TeacherSession = require('../models/teacher-session');
var uuid = require("node-uuid");


function checkLoginInfo (account, password) {
  var pass = true;
  var valObj = {};

  valObj.email = account;
  valObj.mobilePhone = account;
  valObj.loginPassword = password;
  var result = validate(valObj, constraint);

  if (!(result.email || result.mobilePhone)) {
    pass = false;
  }

  if (password.length < constant.PASSWORD_MIN_LENGTH ||
      password.length > constant.PASSWORD_MAX_LENGTH) {
    pass = false;
  }
  return pass;
}

// LoginController.prototype.login = (req, res, next) => {
//     var account = req.body.account;
//     var password = req.body.password;
//     var captcha = req.body.captcha;
//     var error = {};
//
//     async.waterfall([
//         (done) => {
//             if (captcha !== req.session.captcha) {
//                 error.status = constant.httpCode.FORBIDDEN;
//                 done(error, null);
//             } else {
//                 done(null, null);
//             }
//         }, (data, done) => {
//             if (checkLoginInfo(account, password)) {
//                 password = md5(password);
//                 apiRequest.post('login', {email: account, password: password}, done);
//             } else {
//                 error.status = constant.httpCode.UNAUTHORIZED;
//                 done(error, null);
//             }
//         }, (result, done) => {
//             if (result.body.id && result.headers) {
//                 req.session.user = {
//                     id: result.body.id,
//                     role: result.body.role,
//                     userInfo: result.body.userInfo
//                 };
//                 done(null, result);
//             } else {
//                 error.status = constant.httpCode.UNAUTHORIZED;
//                 done(error, null);
//             }
//         }], (error, result) => {
//         if (error !== null && error.status === constant.httpCode.FORBIDDEN) {
//             res.send({status: constant.httpCode.FORBIDDEN});
//             return;
//         } else if (error !== null && error.status === constant.httpCode.UNAUTHORIZED) {
//             res.send({status: constant.httpCode.UNAUTHORIZED});
//             return;
//         } else if (result.status === constant.httpCode.OK) {
//             res.send({status: constant.httpCode.OK, isSuperAdmin: result.body.role === '9'});
//             return;
//         }
//         return next(error);
//     });
// };

function LoginController () {

}

LoginController.prototype.login = (req, res, next) => {
  var account = req.body.account;
  var password = req.body.password;
  var captcha = req.body.captcha;
  var error = {};
  async.waterfall([
    (done) => {
      if (captcha !== req.session.captcha) {
        error.status = constant.httpCode.FORBIDDEN;
        done(error, null);
      } else {
        done(null, null);
      }
    }, (data, done) => {

      if (checkLoginInfo(account, password)) {
        password = md5(password);
        apiRequest.post('login', {email: account, password: password}, done);

      } else {
        error.status = constant.httpCode.UNAUTHORIZED;
        done(error, null);
      }
    }, (result, done) => {
      if (result.body.id && result.headers) {
          var userHash = uuid.v4();
          TeacherSession.findOne({id: result.body.id}, (err, user)=> {
              if (!user) {
                  new TeacherSession({
                      id: result.body.id,
                      role: result.body.role,
                      userInfo: result.body.userInfo,
                      userHash:userHash
                  }).save((err, data)=> {
                      res.cookie('user', userHash,{path:'/'});
                      done(null, result);
                  })
              } else {
                  TeacherSession.update({id: result.body.id}, {$set: {userHash: userHash}}, function (err, obj) {
                      res.cookie('user', userHash,{path:'/'});
                      done(null, result);
                  });
              }
          });

      } else {
        error.status = constant.httpCode.UNAUTHORIZED;
        done(error, null);
      }
    }], (error, result) => {
    if (error !== null && error.status === constant.httpCode.FORBIDDEN) {
      res.send({status: constant.httpCode.FORBIDDEN});
      return;
    } else if (error !== null && error.status === constant.httpCode.UNAUTHORIZED) {
        res.send({status: constant.httpCode.UNAUTHORIZED});
      return;
    } else if (result.status === constant.httpCode.OK) {
        res.send({status: constant.httpCode.OK, isSuperAdmin: result.body.role === '9'});
      return;
    }
    return next(error);
  });
};

module.exports = LoginController;

