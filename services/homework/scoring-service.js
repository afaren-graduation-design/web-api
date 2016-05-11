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
      userHomeworkQuizzes
          .aggregate({
            '$unwind': '$quizzes'
          })
          .match({
            userId: options.user.id,
            paperId: options.paperId,
            "quizzes.id": options.quizId
          })
          .exec((err, docs)=> {
            var histories = docs[0].quizzes.homeworkSubmitPostHistory;
            var len = histories.length;
            if(len) {
              homeworkScoring.findById(histories[len-1], (err, doc)=> {
                options.startTime = doc.commitTime;
                done(null, homeworkQuiz);
              })
            } else {
              options.startTime = docs[0].startTime;
              done(null, homeworkQuiz);
            }
          });

    },

    (homeworkQuiz, done)=> {
      homeworkQuizDefinition = homeworkQuiz.evaluateScript;
      //todo 增加commitTime
      options.startTime = new Date().getTime() / 1000;
      homeworkScoring.create(options, done);
    },

    (data, done)=> {
      userHomeworkQuizzes.findOne({
        userId: options.user.id,
        paperId: options.paperId
      }, (err, doc)=> {
        var theQuiz = doc.quizzes.find((quiz)=> {
          return quiz.id === options.quizId;
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
        done(err, resp);
      })
    }
  ], callback);
}

module.exports = {
  createScoring: createScoring,
  updateScoring: updateScoring
};