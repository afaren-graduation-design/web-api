var apiRequest = require('../api-request');
var mongoose = require('mongoose');
var Message = require('../../models/messages');
var Paper = require('../../models/paper');
var async = require('async');


class AnswerService {

  getAgreeRequestAnswerMessage({from, type, deeplink}, callback) {
    async.waterfall([
      (done) => {
        Message.findOne({from, type, deeplink}, done)
      },
      (data, done) => {
        let id = mongoose.Types.ObjectId(deeplink);
        if (data) {
          Paper.aggregate()
            .unwind('$sections')
            .unwind('$sections.quizzes')
            .match({'sections.quizzes._id': id})
            .exec(done);
        } else {
          done(null, null);
        }
      },
      (doc, done) => {
        Paper.populate(doc, 'sections.quizzes.quizId', done);
      },
      (data, done) => {
        const answerPath = data[0].sections.quizzes.quizId.answerPath;
        done(null, answerPath);
      }
    ], callback);
  }
}

module.exports = AnswerService;
