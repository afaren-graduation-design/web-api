var mongoose = require('mongoose');
var QuestionService = require('../services/question-service');
const questionService = new QuestionService();

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
}

module.exports = QuestionController;
