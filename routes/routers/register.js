'use strict';

var express = require('express');
var router = express.Router();
var request = require('superagent');
var lang = require('../../mixin/lang-message/chinese');
var constant = require('../../mixin/constant').backConstant;
var async = require('async');
var validate = require('validate.js');
var md5 = require('js-md5');
var constraint = require('../../mixin/register-constraint');
var httpStatus = require('../../mixin/constant').httpCode;
var apiRequest = require('../../services/api-request');
var configuration = require('../../models/configuration');
var UserChannel = require('../../models/user-channel');
var mongoose = require('mongoose');

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

router.post('/', function (req, res) {
  var registerInfo = req.body;
  var result = {};
  result.data = {};


  if (checkRegisterInfo(registerInfo)) {
    var isMobilePhoneExist = false;
    var isEmailExist = false;
    var isCaptchaError = false;

    async.waterfall([(done)=> {
        configuration.findOne({}, (err, data) => {
          if (!data.registerable) {
            done("注册已关闭", data);
          } else {
            done(null, null);
          }
        });
      },
        (data, done)=> {
          if (registerInfo.captcha !== req.session.captcha) {
            isCaptchaError = true;
            done(true, null);
          } else {
            done(null, null);
          }
        },
        (data, done)=> {
          apiRequest.get('users', {field: 'mobilePhone', value: registerInfo.mobilePhone}, function (err, resp) {
            if (resp.body.uri) {
              isMobilePhoneExist = true;
            }
            done(err, resp);
          });
        },
        (data, done) => {
          apiRequest.get('users', {field: 'email', value: registerInfo.email}, function (err, resp) {
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
        (data, done)=> {
          delete registerInfo.captcha;
          registerInfo.password = md5(registerInfo.password);
          apiRequest.post('register', registerInfo, done);
        },
          (data, done) => {
          var userChannel = new UserChannel({
          userId: data.body.id,
          channelId: new mongoose.Types.ObjectId(req.cookies.channel)
        });
          userChannel.save((err, doc) => {
          done(err, doc)
        });
        },
        (data, done)=> {
          apiRequest.post('login', {email: registerInfo.email, password: registerInfo.password}, done);
        },
        (data, done)=> {
          if (data.body.id && data.headers) {
            req.session.user = {
              id: data.body.id,
              role: data.body.role,
              userInfo: data.body.userInfo
            };
          }
          done(null, data);
        }
      ],
      (err, data) => {
        if (!data.registerable && (data.registerable !== undefined)) {
          res.status(constant.FORBIDDEN);
          res.send({
            status: constant.FORBIDDEN,
            registerable: data.registerable
          });
        }

      },
      (err, data) => {
        if (err === true) {
          res.send({
            status: constant.FAILING_STATUS,
            message: lang.EXIST,
            data: {
              isEmailExist: isEmailExist,
              isMobilePhoneExist: isMobilePhoneExist,
              isCaptchaError: isCaptchaError
            }
          });
        } else if (!err) {
          res.send({
            status: data.status,
            message: lang.REGISTER_SUCCESS
          });
        } else {
          res.status(httpStatus.INTERNAL_SERVER_ERROR);
          res.send({
            message: lang.REGISTER_FAILED,
            status: constant.SERVER_ERROR
          });
        }
      });
  }
});

router.get('/validate-mobile-phone', function (req, res) {
  apiRequest.get('users', {field: 'mobilePhone', value: req.query.mobilePhone}, function (err, result) {
    if (!result) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.send();
      return;
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
});

router.get('/validate-email', function (req, res) {
  apiRequest.get('users', {field: 'email', value: req.query.email}, function (err, result) {
    if (!result) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.send();
      return;
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
});

router.get('/registerable', function (req, res, next) {

  async.waterfall([
    (done)=> {
      configuration.findOne({}, done);
    }], (err, data)=> {
    if (err) return next(err);
    res.send({
      registerable: data.registerable,
      status: constant.OK
    })
  })
});
module.exports = router;