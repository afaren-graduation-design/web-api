'use strict';

var async = require('async');
var request = require('superagent');
var mongoose = require('mongoose');
var userHomeworkQuizzes = require('../../models/user-homework-quizzes');
var homeworkScoring = require('../../models/homework-scoring');
var yamlConfig = require('node-yaml-config');
var config = yamlConfig.load(__dirname + '/../../config/config.yml');
var apiRequest = require('../api-request');

var taskApi = config.taskApi;
var nginxServer = config.nginxServer;

function getQuiz(options, callBack) {
  callBack(null, options);
}

function createScoring(options, callBack) {
  var homeworkQuizDefinition;
  async.waterfall([

    (done)=> {
      apiRequest.get(options.homeworkQuizUri, function(err, data) {
        done(err, data.body)
      });
    },

    (homeworkQuiz, done)=> {
      homeworkQuizDefinition = homeworkQuiz.evaluateScript;
      homeworkScoring.create(options, done);
    },

    (data, done)=> {
      userHomeworkQuizzes.findOne({
        userId: options.user.id,
        paperId: options.paperId
      }, (err, doc)=> {
        var theQuiz = doc.quizzes.find((quiz)=> {
          return quiz.uri === options.homeworkQuizUri;
        });
        theQuiz.homeworkSubmitPostHistory.push(data._id);
        doc.save(()=> {
          done(null, null);
        });
      })
    },

    (data, done)=> {
      var scriptPath = nginxServer + homeworkQuizDefinition;
      request
          .get(scriptPath)
          .buffer()
          .end(function(err, data) {
            done(null, data.text);
          })
    },

    (script, done)=> {
      request
          .post(taskApi)
          .type('form')
          .send({
            script: script
          })
          .end(done);
    }
  ], callBack)
}

function updateScoring(options, callback) {
  async.waterfall([

    (done)=> {
      options.result = new Buffer(options.result || "", 'base64').toString('utf8');
      homeworkScoring.update(options.historyId, options, done);
    },

    (data, done)=> {
      userHomeworkQuizzes.updateStatus({
        historyId: options.historyId,
        status: options.status
      }, done);
    },

    (data, done)=> {
      var id = new mongoose.Types.ObjectId(options.historyId);
      userHomeworkQuizzes
          .aggregate([
            {'$unwind': '$quizzes'},
            {'$unwind': '$quizzes.homeworkSubmitPostHistory'}
          ])
          .match({'quizzes.homeworkSubmitPostHistory': id})
          .exec((err, docs)=> {
            done(err, docs[0]);
          });
    },

    (doc, done)=> {
      homeworkScoring.findById(doc.quizzes.homeworkSubmitPostHistory, function(err, history) {
        doc.quizzes.homeworkSubmitPostHistory = history.toJSON();
        done(err, doc);
      })
    },

    (data, done)=> {
      delete data.quizzes.homeworkSubmitPostHistory._id;
      delete data.quizzes.homeworkSubmitPostHistory.__v;
      var data = {
        "examerId": data.userId,
        "paperId": data.paperId,
        "homeworkSubmits": [{
          "homeworkQuizId": data.quizzes.id,
          "homeworkSubmitPostHistory":[data.quizzes.homeworkSubmitPostHistory]
        }]
      };

      done(null, data);
    },

    (data, done)=> {
      apiRequest.post('scoresheets', data, (err, resp)=> {
        debugger;
        done(err, resp);
      })
    }
  ], callback);
}

module.exports = {
  createScoring: createScoring,
  updateScoring: updateScoring
};