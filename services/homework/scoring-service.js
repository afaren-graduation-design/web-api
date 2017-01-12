'use strict';

var async = require('async');
var request = require('superagent');
var mongoose = require('mongoose');
var homeworkScoring = require('../../models/homework-scoring');
var yamlConfig = require('node-yaml-config');
var path = require('path');
var config = yamlConfig.load(path.join(__dirname, '/../../config/config.yml'));
var scriptBasePath = path.join(__dirname, '/../..');
var apiRequest = require('../api-request');
var fs = require('fs');
var os = require('os');
var taskApi = config.taskApi;
var {HomeworkQuizSubmit} = require('../../models/quiz-submit');
var Paper = require('../../models/paper');
var {QuizSubmit} = require('../../models/quiz-submit');

function createScoring(options, callback) {
  var homeworkQuizDefinition;
  var result;
  var homeworkSubmitId = '';
  async.waterfall([
    (done) => {
      apiRequest.get(options.homeworkQuizUri, function (err, resp) {
        done(err, resp.body);
      });
    },
    (homeworkQuiz, done) => {
      homeworkQuizDefinition = homeworkQuiz.evaluateScript;
      if (homeworkQuizDefinition[0] === '.') {
        homeworkQuizDefinition = homeworkQuizDefinition.substr(1, homeworkQuizDefinition.length);
      }
      options.commitTime = parseInt(new Date().getTime() / 1000);
      homeworkScoring.create(options, done);
    },
    (data, done) => {
      result = data;
      let homeworkQuizSubmit = new HomeworkQuizSubmit({homeworkScoringId: result._id});
      homeworkQuizSubmit.save((err, doc) => {
        done(err, doc);
      });
    },
    (doc, done) => {
      homeworkSubmitId = doc._id;
      Paper.findOne({'sections.quizzes._id': options.quizId}, done);
    },
    (doc, done) => {
      doc.sections.forEach(section => {
        let dot = section.quizzes.find(quiz => quiz._id.toString() === options.quizId.toString());
        if (dot) {
          dot.submits.push(homeworkSubmitId);
        }
      });
      Paper.findByIdAndUpdate(doc._id, doc, done);
    },
    (doc, done) => {
      var scriptPath = scriptBasePath + homeworkQuizDefinition;
      fs.exists(scriptPath, function (fileOk) {
        if (fileOk) {
          fs.readFile(scriptPath, 'utf-8', function (error, data) {
            if (error) {
              done(error, null);
            } else {
              done(null, data);
            }
          });
        } else {
          done(true, 'file not found');
        }
        ;
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
        .end((err, data)=> {
        console.log(data)
          done(err, data)
        });
    }
  ], (err, result) => {
    callback(err, result);
  });
}

function updateScoring(options, callback) {
  let submitPostHistory;
  async.waterfall([
    (done) => {
      options.result = new Buffer(options.result || '', 'base64').toString('utf8');
      homeworkScoring.findByIdAndUpdate({
        _id: options.historyId
      }, options, done);
    },
    (doc, done) => {
    submitPostHistory = doc;
      QuizSubmit.findOne({homeworkScoringId: options.historyId})
        .exec(done)
    },
    (doc, done) => {
      Paper.findOne({'sections.quizzes.submits': doc._id})
        .exec(done)
    },
    (data, done) => {
      var homeworkData = {
        'examerId': data.userId,
        'paperId': data.paperId,
        'homeworkQuizSubmits': [{
          'homeworkQuizId': 1,
          'homeworkSubmitPostHistory': [submitPostHistory]
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
