'use strict';
var apiRequest = require('../services/api-request');
var async = require('async');
var request = require('superagent');
var constant = require('../mixin/constant');

var clientId = 'ce0a67bb236aaabe4cd6';
var clientSecret = '0e294a6b832bd6365f5186502a794116730bc092';
var redirectUri = 'http://192.168.99.100:8888/api/auth/github/callback';
var scope = '';
var state = Math.random();

function AuthController() {

}

AuthController.prototype.loginWithGitHub = (req, res)=> {
  var authUrl = 'https://github.com/login/oauth/authorize?' +
      'client_id=' + clientId +
      '&redirect_uri=' + redirectUri +
      '&scope=' + scope +
      '&state' + state;
  res.redirect(authUrl);
};

AuthController.prototype.gitHubCallback = (req, res, next) => {
  var githubUserId;
  async.waterfall([
    (done) => {
      request.post('https://github.com/login/oauth/access_token')
          .set('Content-Type', 'application/json')
          .send({
            "client_id": clientId,
            "client_secret": clientSecret,
            "code": req.query.code,
            "redirect_uri": redirectUri
          })
          .end(function(err, response) {
            done(err, response.body.access_token);
          });
    },
    (data, done) => {
      request
          .get('https://api.github.com/user?access_token=' + data)
          .set('Content-Type', 'application/json')
          .end(done);
    },
    (data, done) => {
      githubUserId = data.body.id;
      var queryData = {'thirdPartyUserId' : githubUserId};
      var uri = 'auth/thirdParty/github';
      apiRequest.get(uri, queryData, function (err,resp) {
        done(!err, err);
      })
    },
    (err, done) => {
      if(err.status === constant.httpCode.NOT_FOUND) {
        var userData = {
          email: '',
          mobilePhone: '',
          password: ''
        };
        apiRequest.post('register', userData, function(err, res) {
          var result = {userId: res.body.id, thirdPartyUserId: githubUserId};
          done(err, result);
        });
      }else {
        done(err);
      }
    },
    (data, done) => {
      apiRequest.post('auth/thirdParty/github', data, done);
    }
  ], function (err) {
    if(err && err !== true) {
      next(err.stack);
    }else {
     res.send({statusCode:constant.httpCode.OK});
    }
  })
};
module.exports = AuthController;