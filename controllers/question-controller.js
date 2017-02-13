var mongoose = require('mongoose');
var QuestionService = require('../services/question-service');
var AnswerService = require('../services/answer/answer-service');
const questionService = new QuestionService();
const answerService = new AnswerService();

class QuestionController {
  getQuestion(req, res, next) {
    const questionId = req.params.questionId;
    var id = mongoose.Types.ObjectId(questionId);
    questionService.operate(id, (err, data) => {
      if (err) {
        return next(err);
      }
      res.status(200).send(data);
    });
  }

  getAnswer(req, res, next) {
    const {from, type, deeplink} = req.body;
    answerService.getAgreeRequestAnswerMessage({from, type, deeplink}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.status(200).send({answerPath: data});
    })
  }
}

module.exports = QuestionController;
