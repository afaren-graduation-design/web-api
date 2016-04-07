/*eslint no-magic-numbers: 2*/
'use strict';

var apiRequest = require('../services/api-request');
var superAgent = require('superagent');
var constant = require('../mixin/constant');
var async = require('async');
var userHomeworkQuizzes = require('../models/user-homework-quizzes');
var yamlConfig = require('node-yaml-config');
var config = yamlConfig.load('./config/config.yml');
var moment = require('moment');
var ejs = require('ejs');
var fs = require('fs');

var BREAK_LINE_CODE = 10;

function PaperController() {
}

function setCommitHistoryfilter(userhomeworks) {
  var CommitHistoryfilter = [];

  userhomeworks.forEach((userhomework)=> {

    var objectIds = [];
    userhomework.quizzes.forEach((quiz)=> {
      if (quiz.homeworkSubmitPostHistory.length !== 0) {
        objectIds.push(quiz.homeworkSubmitPostHistory[quiz.homeworkSubmitPostHistory.length - 1]);
      }
    });

    CommitHistoryfilter = CommitHistoryfilter.concat(objectIds);
  });

  return CommitHistoryfilter;
}

function getUsersCommitHistory(commitHistoryFilter, callback) {

  var filter = {
    'id': commitHistoryFilter
  };

  var url = config.taskServer + 'tasks';

  superAgent.get(url)
      .set('Content-Type', 'application/json')
      .query({
        filter: JSON.stringify(filter)
      })
      .end(callback);
}

function getUserDataByPaperId(paperId, callback) {

  var logicPuzzleURL = 'papers/' + paperId + '/logicPuzzle';
  var usersDetailURL = 'papers/' + paperId + '/usersDetail';
  var userData = {};

  async.waterfall([
    (done)=> {
      apiRequest.get(usersDetailURL, (err, usersDetail) => {
        userData.usersDetail = usersDetail.body;
        done(err, null);
      })
    },

    (data, done)=> {
      apiRequest.get(logicPuzzleURL, (err, logicPuzzle) => {
        userData.logicPuzzle = logicPuzzle.body;
        done(err, null);
      });
    },

    (data, done)=> {
      userHomeworkQuizzes.find({paperId: paperId}, (err, userhomeworks) => {
        userData.homeworks = userhomeworks;
        done(err, userhomeworks);
      });
    },

    (userhomeworks, done)=> {
      var commitHistoryFilter = setCommitHistoryfilter(userhomeworks);
      getUsersCommitHistory(commitHistoryFilter, (err, usersCommitHistory)=> {
        userData.usersCommitHistory = usersCommitHistory.body;
        done(err, null);
      });

    }], (err, result)=> {
    callback(err, userData);
  });
}

function buildUserSummary(data) {
  return {
    name: data.name,
    mobilePhone: data.mobilePhone,
    email: data.email
  };
}

function buildHomework(homeworks, usersCommitHistory, userId) {

  var sumTime = 0;
  var correctNumber = 0;
  var startTime = 0;
  var homework = {};

  var data = homeworks.find((homework)=> {
    return homework.userId === userId;
  });

  if (!data || !data.quizzes) {
    return {};
  }

  data.quizzes.forEach(function (quiz, index) {
    var elapsedTime = 0;

    if (quiz.homeworkSubmitPostHistory.length !== 0) {

      var lasthSubmitHistoryId = quiz.homeworkSubmitPostHistory[quiz.homeworkSubmitPostHistory.length - 1];

      var lastSubmitHistory = usersCommitHistory.find((log)=> {
        return log.id === lasthSubmitHistoryId.toString();
      });

      if (lastSubmitHistory) {
        var lastSubmitHistoryCommitTime = Date.parse(lastSubmitHistory.createdAt) / constant.time.MILLISECOND_PER_SECONDS;
        elapsedTime = lastSubmitHistoryCommitTime - quiz.startTime;
      }

    }

    if ((quiz.homeworkSubmitPostHistory.length !== 0) && quiz.status === constant.homeworkQuizzesStatus.SUCCESS) {
      correctNumber++;
    }

    if (index === 0) {
      startTime = quiz.startTime;
    }

    sumTime += elapsedTime;
  });


  homework.correctNumber = correctNumber;
  homework.itemNumber = data.quizzes.length;
  homework.homeWorkStartTime = startTime;
  homework.elapsedTime = sumTime;

  return homework;
}

function buildScoresheetInfo(paperId, callback) {

  getUserDataByPaperId(paperId, function (err, usersData) {
    if (err) {
      callback(err);
      return;
    }

    var result = usersData.usersDetail.map((detail) => {
      var userSummary = buildUserSummary(detail);

      var logicPuzzleSummary = usersData.logicPuzzle.find((item) => {
        return item.userId === detail.userId;
      });

      var homeworkSummary = buildHomework(usersData.homeworks, usersData.usersCommitHistory, detail.userId);
      homeworkSummary.paperId = paperId;
      return Object.assign({}, userSummary, logicPuzzleSummary, homeworkSummary);
    });

    callback(null, result);
  });

}

PaperController.prototype.exportPaperScoresheetCsv = (req, res, next)=> {
  var paperId = req.params.paperId;

  buildScoresheetInfo(paperId, function (err, scoresheetInfo) {
    if (err) {
      next(err);
      return;
    }

    fs.readFile(__dirname + '/../views/paperscoresheetcsv.ejs', function (err, data) {

      var time = moment.unix(new Date() / constant.time.MILLISECOND_PER_SECONDS).format('YYYY-MM-DD');
      var fileName = time + '/paper-' + paperId + '.csv';

      res.setHeader('Content-disposition', 'attachment; filename=' + fileName + '');
      res.setHeader('Content-Type', 'text/csv');

      var csv = ejs.render(data.toString(), {
        scoresheetInfo: scoresheetInfo,
        moment: moment,
        constant: constant,
        config: config
      });

      csv = csv.split(String.fromCharCode(BREAK_LINE_CODE)).join('');
      csv = csv.split('##').join(String.fromCharCode(BREAK_LINE_CODE));

      res.send(csv);
    });

  });
};

function getHomeworkDetailsByUserId(userId, callback) {
  var userDetailURL = 'users/' + userId + '/detail';

  async.parallel({
    userDetail: function (done) {
      apiRequest.get(userDetailURL, done);
    },
    homework: function (done) {
      userHomeworkQuizzes.findOne({userId: userId}, done);
    }
  }, callback);
}

function createHomeworkDetail(quiz) {
  var homeworkDetails = {};
  var sumTime = 0;
  var elapsedTime = 0;

  if (quiz.homeworkSubmitPostHistory.length !== 0) {
    var homeworkSubmitPostHistoryLength = quiz.homeworkSubmitPostHistory.length - 1;
    elapsedTime = quiz.homeworkSubmitPostHistory[homeworkSubmitPostHistoryLength].commitTime - quiz.startTime;

    if (quiz.homeworkSubmitPostHistory[quiz.homeworkSubmitPostHistory.length - 1].homeworkDetail !== undefined) {
      homeworkDetails.lastCommitedDetail = new Buffer(quiz.homeworkSubmitPostHistory[quiz.homeworkSubmitPostHistory.length - 1].homeworkDetail, 'base64').toString('utf8');
    } else {
      homeworkDetails.lastCommitedDetail = '--';
    }
  } else {
    homeworkDetails.lastCommitedDetail = '--';
  }

  sumTime += elapsedTime;

  homeworkDetails.id = quiz.id;
  homeworkDetails.address = quiz.uri;
  homeworkDetails.startTime = quiz.startTime;
  homeworkDetails.commitNumbers = quiz.homeworkSubmitPostHistory.length;
  homeworkDetails.elapsedTime = sumTime;
  homeworkDetails.isPassed = (quiz.status === constant.homeworkQuizzesStatus.SUCCESS) ? '是' : '否';
  return homeworkDetails;
}

function createUserHomeworkDetails(paperId, userId, callback) {

  getHomeworkDetailsByUserId(userId, (err, data)=> {

    var userHomeworkDetails = {};
    if (err) {
      callback(err);
      return;
    }

    if (!data || !data.homework.quizzes) {
      callback(null, {});
    }

    var usersInfo = data.homework.quizzes.map((quiz, index)=> {
      var userDetail;
      if (index === 0) {
        userDetail = buildUserSummary(data.userDetail.body);
      } else {
        userDetail = buildUserSummary({
          name: '',
          mobilePhone: '',
          email: ''
        });
      }

      return {
        userDetail: userDetail,
        userId: userId,
        homeworkDetails: createHomeworkDetail(quiz)
      };
    });
    userHomeworkDetails.usersInfo = usersInfo;
    callback(null, userHomeworkDetails);
  });
}

function createUserHomeworkDetailsCsv(paperId, userHomeworkDetails, callback) {

  var fieldNames = ['姓名', '电话', '邮箱', '编程题编号', '编程题地址', '开始时间', '提交次数', '编程题花费时间', '编程题是否通过', '最后一次提交详情', '提交历史详情'];

  var usersCsvInfo = userHomeworkDetails.usersInfo.map((userInfo)=> {
    var startTime = userInfo.homeworkDetails.startTime;
    startTime = startTime === undefined ? '--' : moment.unix(userInfo.homeworkDetails.startTime).format('YYYY-MM-DD HH:mm:ss');

    return {
      name: userInfo.userDetail.name,
      mobilePhone: userInfo.userDetail.mobilePhone,
      email: userInfo.userDetail.email,
      id: userInfo.homeworkDetails.id,
      address: userInfo.homeworkDetails.address,
      startTime: startTime,
      commitNumbers: userInfo.homeworkDetails.commitNumbers,
      elapsedTime: calcHomeworkElapsedTime(userInfo.homeworkDetails.elapsedTime),
      isPassed: userInfo.homeworkDetails.isPassed,
      lastCommitedDetail: userInfo.homeworkDetails.lastCommitedDetail,
      homeworkDetailsUrl: config.appServer + 'paper/' + paperId + '/user/' + userInfo.userId + '/homeworkQuiz/' + userInfo.homeworkDetails.id
    };
  });

  var fields = ['name', 'mobilePhone', 'email', 'id', 'address', 'startTime', 'commitNumbers', 'elapsedTime', 'isPassed', 'lastCommitedDetail', 'homeworkDetailsUrl'];

  json2csv({data: usersCsvInfo, fields: fields, fieldNames: fieldNames}, function (err, csv) {
    callback(csv);
  });
}

PaperController.prototype.exportUserHomeworkDetailsCsv = (req, res, next)=> {
  var paperId = req.params.paperId;
  var userId = req.params.userId;

  createUserHomeworkDetails(paperId, userId, function (err, userHomeworkDetails) {
    if (err) {
      next(err);
      return;
    }
    createUserHomeworkDetailsCsv(paperId, userHomeworkDetails, function (csv) {

      var time = moment.unix(new Date() / constant.time.MILLISECOND_PER_SECONDS).format('YYYY-MM-DD');
      var fileName = time + '-paper-' + paperId + '-user-' + userId + '.csv';

      csv = csv.split('\\n').join(String.fromCharCode(BREAK_LINE_CODE));
      res.setHeader('Content-disposition', 'attachment; filename=' + fileName + '');
      res.setHeader('Content-Type', 'text/csv');

      res.send(csv);
    });
  });
};

function buildUserHomeworkQuizDetail(commitItem) {
  var homeworkQuizDetail = {};
  homeworkQuizDetail.commitAddress = commitItem.homeworkURL;
  homeworkQuizDetail.homeworkDetail = (commitItem.homeworkDetail === undefined) ? '--' : new Buffer(commitItem.homeworkDetail, 'base64').toString('utf8');
  return homeworkQuizDetail;
}

function calculateElapsedTime(index, homeworkquiz) {
  var time;
  if (index === 0) {
    time = homeworkquiz.homeworkSubmitPostHistory[index].commitTime - homeworkquiz.startTime;
  } else {
    time = homeworkquiz.homeworkSubmitPostHistory[index].commitTime - homeworkquiz.homeworkSubmitPostHistory[index - 1].commitTime;
  }
  return time;
}

function buildUserHomeworkQuizDetails(paperId, userId, homeworkquizId, callback) {

  getHomeworkDetailsByUserId(userId, (err, data)=> {
    var userHomeworkDetails = {};
    var usersInfo = [];
    if (err) {
      callback(err);
      return;
    }

    var homeworkquiz = data.homework.quizzes.find((quiz)=> {
      return quiz.id.toString() === homeworkquizId;
    });

    if (homeworkquiz !== undefined && homeworkquiz.homeworkSubmitPostHistory.length !== 0) {

      homeworkquiz.homeworkSubmitPostHistory.forEach((commitItem, index)=> {
        var userInfo = {};
        if (index === 0) {
          userInfo.userDetail = buildUserSummary(data.userDetail.body);
          userInfo.startTime = homeworkquiz.startTime;
          userInfo.uri = homeworkquiz.uri;
        } else {
          userInfo.userDetail = buildUserSummary({
            name: '',
            mobilePhone: '',
            email: ''
          });
          userInfo.startTime = '';
          userInfo.uri = '';
        }
        userInfo.userId = userId;
        userInfo.homeworkDetails = buildUserHomeworkQuizDetail(commitItem);
        userInfo.homeworkDetails.elapsedTime = calculateElapsedTime(index, homeworkquiz);
        usersInfo.push(userInfo);
      });
    }

    userHomeworkDetails.usersInfo = usersInfo;
    callback(null, userHomeworkDetails);
  });
}

function buildUserHomeworkQuizDetailsCsv(paperId, userHomeworkDetails, callback) {

  var fieldNames = ['姓名', '电话', '邮箱', '编程题题目地址', '开始时间', '提交作业记录', '分析记录', '花费时间'];

  var usersCsvInfo = userHomeworkDetails.usersInfo.map((userInfo)=> {
    var startTime = userInfo.startTime;
    startTime = startTime === '' ? '' : moment.unix(startTime).format('YYYY-MM-DD HH:mm:ss');
    return {
      name: userInfo.userDetail.name,
      mobilePhone: userInfo.userDetail.mobilePhone,
      email: userInfo.userDetail.email,
      homeworkAddress: userInfo.uri,
      startTime: startTime,
      commitUrlLog: userInfo.homeworkDetails.commitAddress,
      commitResultLog: userInfo.homeworkDetails.homeworkDetail,
      elapsedTime: calcHomeworkElapsedTime(userInfo.homeworkDetails.elapsedTime)
    };
  });

  var fields = ['name', 'mobilePhone', 'email', 'homeworkAddress', 'startTime', 'commitUrlLog', 'commitResultLog', 'elapsedTime'];

  json2csv({data: usersCsvInfo, fields: fields, fieldNames: fieldNames}, function (err, csv) {
    callback(csv);
  });
}

PaperController.prototype.exportUserHomeworkQuizDetailsCsv = (req, res, next)=> {
  var paperId = req.params.paperId;
  var userId = req.params.userId;
  var homeworkquizId = req.params.homeworkquizId;

  buildUserHomeworkQuizDetails(paperId, userId, homeworkquizId, (err, userHomeworkDetails)=> {
    if (err) {
      next(err);
      return;
    }

    buildUserHomeworkQuizDetailsCsv(paperId, userHomeworkDetails, (csv) => {
      var time = moment.unix(new Date() / constant.time.MILLISECOND_PER_SECONDS).format('YYYY-MM-DD');
      var fileName = time + '-paper-' + paperId + '-user-' + userId + '-homeworkquiz-' + homeworkquizId + '.csv';

      csv = csv.split('\\n').join(String.fromCharCode(BREAK_LINE_CODE));
      res.setHeader('Content-disposition', 'attachment; filename=' + fileName + '');
      res.setHeader('Content-Type', 'text/csv');
      res.send(csv);
    });
  });
};

module.exports = PaperController;
