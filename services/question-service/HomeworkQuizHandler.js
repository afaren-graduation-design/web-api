var OperateHandler = require('./OperateHandler');
var async = require('async');
const constant = require('../../mixin/constant');
var Paper = require('../../models/paper');
var HomeworkScoring = require('../../models/homework-scoring');

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
            previousQuiz = currentIndex !== 0 ? section.quizzes[currentIndex - 1] : {submits: [{status: 4}]};
            done(null, previousQuiz);
          }
        });
      },
      (previousQuiz, done) => {
        if (quizzes.submits.length) {
          HomeworkScoring.findOne({_id: quizzes.submits[quizzes.submits.length - 1].homeworkScoringId})
            .exec((err, doc) => {

              submits = doc;
              status = submits.status;
              done(err, doc);
            })

        } else {
          if (previousQuiz.submits[previousQuiz.submits.length - 1].homeworkScoringId) {
            HomeworkScoring.findOne({_id: previousQuiz.submits[previousQuiz.submits.length - 1].homeworkScoringId})
              .exec((err, doc) => {
                if (err) {
                  done(err, null);
                } else {
                  status = doc.status === constant.homeworkQuizzesStatus.SUCCESS
                    ? constant.homeworkQuizzesStatus.ACTIVE : constant.homeworkQuizzesStatus.LOCKED;
                }
                done(err, doc);
              });
          } else {
            status = constant.homeworkQuizzesStatus.ACTIVE;
            done(null, status);
          }
        }
      },
      (data, done) => {
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
