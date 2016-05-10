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
      //var historyId = new mongoose.Types.ObjectId(options.historyId);
      //userHomeworkQuizzes.findOne({'quizzes.homeworkSubmitPostHistory': historyId}, (err, doc)=> {
      //  var theQuiz = doc.quizzes.find((item)=> {
      //    return item.homeworkSubmitPostHistory.indexOf(historyId) > -1;
      //  });
      //  theQuiz.status = options.status;
      //  doc.save(done);
      //});
    }
  ], callback);
}

module.exports = {
  createScoring: createScoring,
  updateScoring: updateScoring
};