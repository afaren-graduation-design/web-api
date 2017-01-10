'use strict';

var logicPuzzles = require('../models/logic-puzzle');
var constant = require('../mixin/constant');
var async = require('async');
var apiRequest = require('../services/api-request');

function LogicPuzzleController() {
}

LogicPuzzleController.prototype.getLogicPuzzle = (req, res) => {
  var orderId = req.query.orderId;
  var id = req.query.id;
  var userId = req.session.user.id;

  logicPuzzles.getLogicPuzzle(orderId, userId, id)
    .then((data) => {
      res.send(data);
    });
};

LogicPuzzleController.prototype.saveAnswer = (req, res) => {
  var orderId = req.body.orderId;
  var userAnswer = req.body.userAnswer;
  var userId = req.session.user.id;
  var sectionId = req.body.sectionId;

  async.waterfall([
    (done) => {
      logicPuzzles.findOne({userId: userId, _id: sectionId}, done);
    }, (data, done) => {
      if (orderId > data.quizExamples.length - 1) {
        data.quizItems[orderId - data.quizExamples.length].userAnswer = userAnswer;
        data.save((err, doc) => {
          done(err, doc);
        });
      } else {
        done(null, 'doc');
      }
    }, (doc, done) => {
      done();
    }
  ], (err) => {
    if (!err) {
      res.sendStatus(constant.httpCode.OK);
    } else {
      res.sendStatus(constant.httpCode.INTERNAL_SERVER_ERROR);
    }
  });
};

LogicPuzzleController.prototype.submitPaper = (req, res) => {
  var examerId = req.session.user.id;
  var startTime;
  var endTime = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
  // var sectionId = req.query.sectionId ? parseInt(req.query.sectionId) : 1;
  var sectionId = req.body.sectionId;
  async.waterfall([
    (done) => {
      logicPuzzles.findOne({userId: examerId, _id: sectionId}, done);
    },
    (data, done) => {
      if (data) {
        var thisSection = data.sections[0];
        thisSection.endTime = endTime;
        startTime = thisSection.startTime;
        data.isCommited = true;
      }
      data.save((err, doc) => {
        done(err, doc);
      });
    },
    (data, done) => {
      var scoreSheetData = {
        data: data,
        startTime: startTime,
        endTime: endTime
      };
      LogicPuzzleController.setScoreSheet(scoreSheetData, done);
    }
  ], (err) => {
    if (err) {
      res.status(constant.httpCode.INTERNAL_SERVER_ERROR).send(err.stack);
    } else {
      res.sendStatus(constant.httpCode.OK);
    }
  });
};

LogicPuzzleController.setScoreSheet = (scoreSheetData, done) => {
  var scoreSheetUri = 'scoresheets';
  var itemPosts = [];
  var data = scoreSheetData.data;
  var paperId = data.paperId;
  // var programId = data.programId;
  data.quizItems.forEach((quizItem) => {
    itemPosts.push({answer: quizItem.userAnswer, quizItemId: quizItem.id});
  });

  var body = {
    examerId: data.userId,
    paperId: paperId,
    // programId: programId,
    blankQuizSubmits: [{
      startTime: scoreSheetData.startTime,
      endTime: scoreSheetData.endTime,
      blankQuizId: data.blankQuizId,
      itemPosts: itemPosts
    }]
  };
  apiRequest.post(scoreSheetUri, body, done);
};

module.exports = LogicPuzzleController;
