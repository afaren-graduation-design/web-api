var OperateHandler = require('./OperateHandler');
var async = require('async');
const constant = require('../../mixin/constant');
var Paper = require('../../models/paper');

class HomeworkQuizHandler extends OperateHandler {
  check(quizzes) {
    return quizzes.quizId;
  }

  subHandle(quizzes, callback) {
    let status;
    let desc;
    let submits = {};
    async.waterfall([
      (done) => {
        Paper.findOne({'sections.quizzes._id': quizzes._id})
          .populate(['sections.quizzes.quizId', 'sections.quizzes.submits'])
          .exec(done);
      },
      (doc, done) => {
        let previousQuiz;
        doc.toJSON().sections.forEach((section) => {
          let quiz = section.quizzes.find((quiz) => {
            return quiz._id + '' === quizzes._id + '';
          });

          if (quiz) {
            let currentIndex = section.quizzes.indexOf(quiz);
            previousQuiz = section.quizzes[currentIndex - 1] ? section.quizzes[currentIndex - 1] : {submits: [{status: 4}]};
            done(null, previousQuiz);
          }
        });
      },
      (previousQuiz, done) => {
        if (quizzes.submits.length) {
          submits = quizzes.submits[quizzes.submits.length - 1];
          status = submits.status;
        } else {
          status = previousQuiz.submits[previousQuiz.submits.length - 1].status === constant.homeworkQuizzesStatus.SUCCESS
            ? constant.homeworkQuizzesStatus.ACTIVE : constant.homeworkQuizzesStatus.LOCKED;
        }
        desc = getDesc(status, quizzes.quizId.description);
        done(null, quizzes);
      },
      (quizzes, done) => {
        const homeworkQuiz = {
          uri: quizzes.quizId.uri,
          id: quizzes.quizId.id,
          desc,
          templateRepo: quizzes.quizId.templateRepository,
          userAnswerRepo: submits.userAnswerRepo,
          branch: submits.branch,
          result: submits.result,
          status,
          info: quizzes.info
        };
        done(null, homeworkQuiz);
      }
    ], callback);
  }
}

function getDesc(status, realDesc) {
  if (status === constant.homeworkQuizzesStatus.LOCKED) {
    return '## 当前题目未解锁,请先完成之前的题目.';
  } else {
    return realDesc;
  }
}

module.exports = HomeworkQuizHandler;
