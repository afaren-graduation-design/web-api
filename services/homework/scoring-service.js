'use strict';

var async = require('async');
var request = require('superagent');
var mongoose = require('mongoose');
var userHomeworkQuizzes = require('../../models/user-homework-quizzes');
var homeworkScoring = require('../../models/homework-scoring');
var yamlConfig = require('node-yaml-config');
var path = require('path');
var config = yamlConfig.load(path.join(__dirname, '/../../config/config.yml'));
var scriptBasePath = path.join(__dirname, '/../..');
var apiRequest = require('../api-request');
var fs = require('fs');
var os = require('os');
var taskApi = config.taskApi;

function createScoring(options, callback) {
  var homeworkQuizDefinition;
  var result;
  async.waterfall([
    (done) => {
      apiRequest.get(options.homeworkQuizUri, function(err, data) {
        done(err, data.body);
      });
    },
    // 更新时间
    (homeworkQuiz, done) => {
      var condition = {
        userId: options.user.id,
        paperId: parseInt(options.paperId),
        'quizzes.id': options.quizId
      };
      userHomeworkQuizzes
          .aggregate({
            '$unwind': '$quizzes'
          })
          .match(condition)
          .exec((err, docs) => {
            var histories = docs[0].quizzes.homeworkSubmitPostHistory;
            var len = histories.length;
            if (err) {
              done(err, null);
            } else if (len) {
              homeworkScoring.findById(histories[len - 1], (err, doc) => {
                if (err) {
                  done(err, null);
                } else {
                  options.startTime = doc.commitTime;
                  done(null, homeworkQuiz);
                }
              });
            } else {
              options.startTime = docs[0].quizzes.startTime;
              done(null, homeworkQuiz);
            }
          });
    },
    (homeworkQuiz, done) => {
      homeworkQuizDefinition = homeworkQuiz.homeworkItem.evaluateScript;
      options.commitTime = parseInt(new Date().getTime() / 1000);
      homeworkScoring.create(options, done);
    },
    (data, done) => {
      result = data;
      userHomeworkQuizzes.findOne({
        userId: options.user.id,
        paperId: options.paperId
      }, (err, doc) => {
        if (err) {
          done(err, null);
        } else {
          var theQuiz = doc.quizzes.find((quiz) => {
            return quiz.id === options.quizId;
          });
        }
        theQuiz.status = data.status;
        theQuiz.homeworkSubmitPostHistory.push(data._id);
        doc.save(() => {
          done(null, theQuiz);
        });
      });
    },
    (data, done) => {
      var scriptPath = scriptBasePath + homeworkQuizDefinition;
      fs.exists(scriptPath, function(fileOk) {
        if (fileOk) {
          fs.readFile(scriptPath, 'utf-8', function(error, data) {
            if (error) {
              done(error, null);
            } else {
              done(null, data);
            }
          });
        } else {
          done(true, 'file not found');
        };
      });
    },
    (script, done) => {
      script = script.toString().split('\n').join('\\n');
      var info = {
        script: script,
        user_answer_repo: options.userAnswerRepo,
        branch: options.branch,
        callback_url: `http://${getIp()}:3000/homework/scoring/` + result._id
      };
      request
          .post(taskApi)
          .auth('twars', 'twars')
          .type('form')
          .send(info)
          .end(done);
    }
  ], (err, data) => {
    callback(err, result);
  });
}

function updateScoring(options, callback) {
  async.waterfall([
    (done) => {
      options.result = new Buffer(options.result || '', 'base64').toString('utf8');
      homeworkScoring.update({
        _id: options.historyId
      }, options, done);
    },
    (data, done) => {
      userHomeworkQuizzes.updateStatus({
        historyId: options.historyId,
        status: options.status
      }, done);
    },
    (data, done) => {
      var id = new mongoose.Types.ObjectId(options.historyId);
      userHomeworkQuizzes
          .aggregate([
            {'$unwind': '$quizzes'},
            {'$unwind': '$quizzes.homeworkSubmitPostHistory'}
          ])
          .match({'quizzes.homeworkSubmitPostHistory': id})
          .exec((err, docs) => {
            done(err, docs[0]);
          });
    },
    (doc, done) => {
      homeworkScoring.findById(doc.quizzes.homeworkSubmitPostHistory, function(err, history) {
        doc.quizzes.homeworkSubmitPostHistory = history.toJSON();
        done(err, doc);
      });
    },
    (data, done) => {
      var homeworkData = {
        'examerId': data.userId,
        'paperId': data.paperId,
        'homeworkQuizSubmits': [{
          'homeworkQuizId': data.quizzes.id,
          'homeworkSubmitPostHistory': [data.quizzes.homeworkSubmitPostHistory]
        }]
      };
      done(null, homeworkData);
    },
    (data, done) => {
      // fixme: debug 时 timeout，查看 mock-server 没有这个接口
      apiRequest.post('scoresheets', data, (err, resp) => {
        done(err, resp);
      });
    }
  ], callback);
}

function getIp() {
  var interfaces = os.networkInterfaces();
  var addresses = [];

  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }

  return addresses[0];
}

module.exports = {
  createScoring: createScoring,
  updateScoring: updateScoring
};
