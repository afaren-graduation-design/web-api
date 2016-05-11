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

function getQuiz(options, callback) {
  async.waterfall([
    (done) => {
      userHomeworkQuizzes.findOne({
        userId: options.userId,
        paperId: options.paperId,
        "quizzes.id": options.quizId
      }, done);
    },

    //(data, done) => {
    //  orderId = Math.max(orderId, 1);
    //  orderId = Math.min(orderId, data.quizzes.length);
    //  done(null, data);
    //},
    //
    //(doc, done) => {
    //  var index = orderId - 1;
    //  var data = doc.quizzes[index];
    //  result.uri = data.uri;
    //  result.status = data.status;
    //  histories = data.homeworkSubmitPostHistory;
    //
    //  if (!data.startTime) {
    //    data.startTime = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
    //    doc.save(done);
    //  } else {
    //    done(null, true, true);
    //  }
    //},
    //
    //(product, numAffect, done)=> {
    //  var lastHomeworkSubmitId = histories[histories.length - 1];
    //  request
    //      .get(config.taskServer + 'tasks/' + lastHomeworkSubmitId)
    //      .set('Content-Type', 'application/json')
    //      .end(done);
    //},
    //
    //(data, done) => {
    //  result.userAnswerRepo = data.body.userAnswerRepo;
    //  result.branch = data.body.branch;
    //  result.result = data.body.result;
    //
    //  apiRequest.get(result.uri, done);
    //},
    //
    //(data, done) => {
    //  result.desc = getDesc(result.status, data.body.description);
    //  result.templateRepo = data.body.templateRepository;
    //  done(null, result);
    //}
  ], callback);
}

module.exports = {
  getQuiz: getQuiz
};