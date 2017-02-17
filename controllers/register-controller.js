'use strict';

var lang = require('..//mixin/lang-message/chinese');
var constant = require('../mixin/constant').backConstant;
var async = require('async');
var validate = require('validate.js');
var md5 = require('js-md5');
var constraint = require('../mixin/register-constraint');
var httpStatus = require('../mixin/constant').httpCode;
var apiRequest = require('../services/api-request');
var configuration = require('../models/configuration');
var UserChannel = require('../models/user-channel');
var mongoose = require('mongoose');
var Program = require('../models/program');

function checkRegisterInfo(registerInfo) {
  var pass = true;

  var valObj = {};
  valObj.email = registerInfo.email;
  valObj.mobilePhone = registerInfo.mobilePhone;
  valObj.password = registerInfo.password;

  var result = validate(valObj, constraint);

  if (result !== undefined) {
    pass = false;
  }

  if (registerInfo.password.length < constant.PASSWORD_MIN_LENGTH ||
    registerInfo.password.length > constant.PASSWORD_MAX_LENGTH) {
    pass = false;
  }
  return pass;
}

function RegisterController() {

}

RegisterController.prototype.register = (req, res, next) => {
  var registerInfo = req.body;
  var error = {};
  var userId;

  if (checkRegisterInfo(registerInfo)) {
    var isMobilePhoneExist = false;
    var isEmailExist = false;
    var isCaptchaError = false;

    async.waterfall([
      (done) => {
        configuration.findOne({}, (err, data) => {
          if (err) {
            return next(err);
          }
          if (!data.registerable) {
            error.status = httpStatus.UNAUTHORIZED; //  401 未开放注册
            done(error, data);
          } else {
            done(null, null);
          }
        });
      },
      (data, done) => {
        if (registerInfo.captcha !== req.session.captcha) {
          error.status = httpStatus.FORBIDDEN;  //  403 验证码错误
          isCaptchaError = true;
          done(error, null);
        } else {
          done(null, null);
        }
      }, (data, done) => {
        apiRequest.get('users', {field: 'mobilePhone', value: registerInfo.mobilePhone}, (err, resp) => {
          if (resp.body.uri) {
            isMobilePhoneExist = true;
          }
          done(err, resp);
        });
      }, (data, done) => {
        apiRequest.get('users', {field: 'email', value: registerInfo.email}, (err, resp) => {
          if (resp.body.uri) {
            isEmailExist = true;
          }
          if (isMobilePhoneExist || isEmailExist) {
            done(true, resp);
          } else {
            done(err, resp);
          }
        });
      },
      (data, done) => {
        delete registerInfo.captcha;
        registerInfo.password = md5(registerInfo.password);
        apiRequest.post('register', registerInfo, done);
      },
      (data, done) => {
        userId = data.body.id;
        if (req.cookies.channel !== '') {
          var userChannel = new UserChannel({
            userId: data.body.id,
            channelId: new mongoose.Types.ObjectId(req.cookies.channel)
          });
          userChannel.save((err) => {
            done(err, null);
          });
        } else {
          done(null, null);
        }
      },
      (data, done) => {
        if(!req.cookies.program){
          return done(null, null);
        }
        Program.findById(req.cookies.program, (err, doc)=> {
          done(err, doc)
        });
      },
      (doc, done)=> {
        if(!doc){
          return done(null, null);
        }
        apiRequest.post(`users/${userId}/programs/${doc.programId}`, {}, done);
      },
      (data, done) => {
        apiRequest.post('login', {email: registerInfo.email, password: registerInfo.password}, done);
      },
      (data, done) => {
        if (data.body.id && data.headers) {
          req.session.user = {
            id: data.body.id,
            role: data.body.role,
            userInfo: data.body.userInfo
          };
        }
        done(null, data);
      }
    ], (err, data) => {
      res.clearCookie('program', {path: '/'});

      if (err !== null && error.status === httpStatus.UNAUTHORIZED) {
        res.send({
          status: constant.FORBIDDEN,
          registerable: data.registerable
        });
      } else if (err !== null && error.status === httpStatus.FORBIDDEN) {
        res.send({
          status: constant.FAILING_STATUS,
          message: lang.EXIST,
          data: {
            isEmailExist: isEmailExist,
            isMobilePhoneExist: isMobilePhoneExist,
            isCaptchaError: isCaptchaError
          }
        });
      } else if (err) {
        return next(err);
      } else {
        res.send({
          status: data.status
        });
      }
    });
  }
};

RegisterController.prototype.valdateMobilePhone = (req, res, next) => {
  apiRequest.get('users', {field: 'mobilePhone', value: req.query.mobilePhone}, (err, result) => {
    if (!result) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.send();
      return next(err);
    }
    if (result.body.uri) {
      res.send({
        status: constant.SUCCESSFUL_STATUS
      });
    } else {
      res.send({
        status: constant.FAILING_STATUS
      });
    }
  });
};

RegisterController.prototype.valdateEmail = (req, res, next) => {
  apiRequest.get('users', {field: 'email', value: req.query.email}, (err, result) => {
    if (!result) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.send();
      return next(err);
    }
    if (result.body.uri) {
      res.send({
        status: constant.SUCCESSFUL_STATUS
      });
    } else {
      res.send({
        status: constant.FAILING_STATUS
      });
    }
  });
};

RegisterController.prototype.registerable = (req, res, next) => {
  async.waterfall([
    (done) => {
      configuration.findOne({}, done);
    }], (err, data) => {
    if (err) return next(err);
    res.send({
      registerable: data.registerable,
      status: constant.OK
    });
  });
};

module.exports = RegisterController;
