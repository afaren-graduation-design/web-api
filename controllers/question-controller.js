var mongoose = require('mongoose');
const Paper = require('../models/paper');

class QuestionController {
  getQuestion(req, res, next) {
    let logicPuzzle = {};
    let homeworkQuiz = {};
    const questionId = req.params.questionId;
    var id = mongoose.Types.ObjectId(questionId);
    Paper.aggregate()
      .unwind('$sections')
      .unwind('$sections.quizzes')
      .match({'sections.quizzes._id': id})
      .exec((err, doc) => {
        if (err) {
          return next(err);
        }
        Paper.populate(doc, {path: 'sections.quizzes.quizId'}, (err, docs) => {
          if (err) {
            return next(err);
          }
          const quiz = docs[0].sections.quizzes.quizId;
          const quizType = quiz.__t;
          if (quizType === 'LogicPuzzle') {
            logicPuzzle = {
              item: {
                id: quiz.id,
                initializedBox: quiz.initializedBox,
                question: quiz.question,
                description: quiz.description,
                chartPath: quiz.chartPath
              },
              itemCount: 3
            };
            res.status(200).send(logicPuzzle);
          } else if (quizType === 'HomeworkQuiz') {
            homeworkQuiz = {
              uri: quiz.uri,
              id: quiz.id,
              desc: quiz.description,
              templateRepo: quiz.templateRepository
            };
            res.status(200).send(homeworkQuiz);
          }
        });
      });
  }
}

module.exports = QuestionController;
