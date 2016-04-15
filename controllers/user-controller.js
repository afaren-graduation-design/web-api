/*eslint no-magic-numbers: 2*/
'use strict';

var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');
var async = require('async');
var userHomeworkQuizzes = require('../models/user-homework-quizzes');
var yamlConfig = require('node-yaml-config');
var request = require('superagent');
var config = yamlConfig.load('./config/config.yml');

var percentage = 100;
var hour = constant.time.HOURS_PER_DAY;
var mintues = constant.time.MINUTE_PER_HOUR;
var second = constant.time.SECONDS_PER_MINUTE;

var dayToSecond = second * mintues * hour;
var hourToSecond = second * mintues;
var mintuesToSecond = mintues;

var clientId = 'ce0a67bb236aaabe4cd6';
var clientSecret = '0e294a6b832bd6365f5186502a794116730bc092';
var redirectUri = 'http://192.168.99.100:8888/api/user/auth/github/callback';
var scope = '';
var state = Math.random();

function UserController() {

}

function createUserDetail(data) {
  return {
    name: data.name,
    mobilePhone: data.mobilePhone,
    email: data.email
  };
}

function createLogicPuzzle(data) {
  var accuracy = 0;
  var logicPuzzle = data;

  var itemNumber = logicPuzzle.itemNumber;
  var correctNumber = logicPuzzle.correctNumber;

  if (correctNumber !== 0) {
    accuracy = ((correctNumber / itemNumber) * percentage).toFixed(2);
  }

  return {
    correctNumber: correctNumber,
    itemNumber: itemNumber,
    startTime: logicPuzzle.startTime,
    endTime: logicPuzzle.endTime,
    accuracy: accuracy + '%'
  };
}

function createHomework(data) {
  var sumTime = 0;
  var correctNumber = 0;
  var homework = {
    quizzes: []
  };

  data.quizzes.forEach(function (result) {
    var commitHistory = [];
    var elapsedTime = 0;

    if (result.homeworkSubmitPostHistory.length !== 0) {
      var homeworkSubmitPostHistoryLength = result.homeworkSubmitPostHistory.length - 1;
      result.homeworkSubmitPostHistory.forEach(function (log) {
        var commit = {};
        commit.githubURL = log.homeworkURL;
        commit.branch = log.branch;
        commit.commitTime = log.commitTime;
        commit.resultURL = log.resultURL;
        commitHistory.push(commit);
      });
      elapsedTime = result.homeworkSubmitPostHistory[homeworkSubmitPostHistoryLength].commitTime - result.startTime;
    }
    if ((result.homeworkSubmitPostHistory.length !== 0) && result.homeworkSubmitPostHistory[homeworkSubmitPostHistoryLength].status === constant.homeworkQuizzesStatus.SUCCESS) {
      correctNumber++;
    }

    sumTime += elapsedTime;

    var quiz = {
      startTime: result.startTime,
      homeworkDesc: result.uri,
      elapsedTime: elapsedTime,
      commitHistory: commitHistory
    };
    homework.quizzes.push(quiz);
  });

  var completion = (correctNumber / data.quizzes.length) * percentage;

  homework.elapsedTime = sumTime;
  homework.completion = completion.toFixed(2) + '%';
  homework.correctNumber = correctNumber;
  homework.quizNumber = data.quizzes.length;

  return homework;
}

function getUserDataByUserId(userId, callback) {

  var logicPuzzleURL = 'users/' + userId + '/logicPuzzle';
  var userDetailURL = 'users/' + userId + '/detail';

  async.parallel({
    userDetail: function (done) {
      apiRequest.get(userDetailURL, done);
    },
    logicPuzzle: function (done) {
      apiRequest.get(logicPuzzleURL, done);
    },
    homework: function (done) {
      userHomeworkQuizzes.findOne({userId: userId}, done);
    }
  }, (err, result)=> {

    if (err) {
      callback({
        httpCode: constant.httpCode.NOT_FOUND
      });
    } else {
      callback({
        result: result,
        httpCode: constant.httpCode.OK
      });
    }
  });
}

function createUserInfo(userId, callback) {

  getUserDataByUserId(userId, function (userData) {

    var userInfo = {};
    userInfo.userId = userId;

    if (userData.httpCode !== constant.httpCode.NOT_FOUND) {

      userInfo.userDetail = createUserDetail(userData.result.userDetail.body);
      userInfo.logicPuzle = createLogicPuzzle(userData.result.logicPuzzle.body);
      userInfo.homework = createHomework(userData.result.homework);
      userInfo.httpCode = userData.httpCode;
    } else {
      userInfo.httpCode = constant.httpCode.NOT_FOUND;
    }

    callback(userInfo);
  });

}

UserController.prototype.exportHomeworkDetails = (req, res)=> {

  var userId = req.params.userId;

  createUserInfo(userId, function (userInfo) {

    if (userInfo.httpCode === constant.httpCode.NOT_FOUND) {
      res.sendStatus(constant.httpCode.NOT_FOUND);
    } else {
      res.send({userInfo});
    }
  });
};

function createLogicPuzzleFeedback(data) {
  var isCompleted = false;
  var time = 0;

  if (data.endTime !== 'undefined' && data.endTime !== 0) {

    time = calcLogicPuzzleElapsedTime(data);

    isCompleted = true;
  }

  return {
    isCompleted: isCompleted,
    time: time
  };
}

function createHomeworkFeedback(data) {
  var homework = [];

  data.quizzes.forEach(function (result) {
    var commitHistory = {};

    commitHistory.commitedNumbers = result.homeworkSubmitPostHistory.length;


    if (result.homeworkSubmitPostHistory.length !== 0) {
      var time = result.homeworkSubmitPostHistory[result.homeworkSubmitPostHistory.length - 1].commitTime - result.startTime;
      commitHistory.time = calcHomeworkElapsedTime(time);

    } else {

      commitHistory.time = 0;
    }
    commitHistory.isCompleted = result.status === constant.homeworkQuizzesStatus.SUCCESS;

    homework.push(commitHistory);
  });


  return homework;
}

function creatFeedbackInfo(userId, callback) {

  getUserDataByUserId(userId, function (userData) {
    var userInfo = {};
    userInfo.userId = userId;

    if (userData.httpCode !== constant.httpCode.NOT_FOUND) {

      userInfo.logicPuzzle = createLogicPuzzleFeedback(userData.result.logicPuzzle.body);
      userInfo.homework = createHomeworkFeedback(userData.result.homework);
      userInfo.httpCode = userData.httpCode;
    } else {
      userInfo.httpCode = constant.httpCode.NOT_FOUND;
    }
    callback(userInfo);
  });
}

function calcLogicPuzzleElapsedTime(logicPuzzle) {

  var startTime = logicPuzzle.startTime;
  var endTime = logicPuzzle.endTime;
  var time = endTime - startTime;

  var elapsedHour = 0;
  var elapsedMintues = 0;
  var elapsedSeconds = 0;

  elapsedHour = Math.floor(time / hourToSecond);
  time -= hourToSecond * elapsedHour;
  elapsedMintues = Math.floor(time / mintuesToSecond);
  time -= mintuesToSecond * elapsedMintues;

  return elapsedHour + '小时' + elapsedMintues + '分' + time + '秒';
}

function calcHomeworkElapsedTime(time) {

  var elapsedDay = 0;
  var elapsedHour = 0;
  var elapsedMintues = 0;

  elapsedDay = Math.floor(time / dayToSecond);
  time -= elapsedDay * dayToSecond;
  elapsedHour = Math.floor(time / hourToSecond);
  time -= hourToSecond * elapsedHour;
  elapsedMintues = Math.floor(time / mintuesToSecond);

  return elapsedDay + '天' + elapsedHour + '小时' + elapsedMintues + '分';
}


UserController.prototype.getFeedback = (req, res)=> {
  var userId = req.session.user.id;

  creatFeedbackInfo(userId, function (feedbackInfo) {
    res.send(feedbackInfo);
  });
};

UserController.prototype.loginWithGitHub = (req, res)=> {
  var authUrl = 'https://github.com/login/oauth/authorize?' +
    'client_id=' + clientId +
    '&redirect_uri=' + redirectUri +
    '&scope=' + scope +
    '&state' + state;
  res.redirect(authUrl);
};

UserController.prototype.gitHubCallback = (req, res) => {
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
        .end(function(error, resp) {
          done(error, resp);
        });
    },
    (data, done) => {
      var userData = {
        email: '',
        mobilePhone: '',
        password: ''
      };
      apiRequest.post('register', userData, function(err, res) {
        var result = {userId: res.body.id, thirdPartyId: data.body.id};
        done(err, result);
      });
    },
    (data, done) => {
      apiRequest.post('register/auth/github', data, done);
    },
    (data, done) => {
      console.log(data);
    }
  ])
};

module.exports = UserController;

