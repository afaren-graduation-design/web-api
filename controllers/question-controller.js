const Paper = require('../models/paper');

class QuestionController {
  getQuestion(req, res, next) {
    let logicPuzzle = {};
    let homeworkQuiz = {};
    const questionId = req.params.questionId;
    Paper
        .findOne({'sections.quizzes._id': questionId})
        .populate('sections.quizzes.quizId')
        .exec((err, doc) => {
          if (err) {
            return next(err);
          }
          let quiz, itemCount;
          doc.toJSON().sections.forEach((section) => {
            let isExistQuiz = section.quizzes.find((item) =>
               item._id.toString() === questionId.toString()
            );
            quiz = isExistQuiz || quiz;
            itemCount = isExistQuiz ? section.quizzes.length : itemCount;
          });
          const quizType = quiz.quizId.__t;
          if (quizType === 'LogicPuzzle') {
            logicPuzzle = {
              item: {
                id: quiz.quizId.id,
                initializedBox: quiz.quizId.initializedBox,
                question: quiz.quizId.question,
                description: quiz.quizId.description,
                chartPath: quiz.quizId.chartPath
              },
              itemCount
            };
            res.status(200).send(logicPuzzle);
          } else if (quizType === 'HomeworkQuiz') {
            homeworkQuiz = {
              uri: quiz.quizId.uri,
              id: quiz.quizId.id,
              desc: quiz.quizId.description,
              templateRepo: quiz.quizId.templateRepository
            };
            res.status(200).send(homeworkQuiz);
          }
        });
  }
}

module.exports = QuestionController;
