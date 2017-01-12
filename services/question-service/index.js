var async = require('async');
var Paper = require('../../models/paper');
var LogicPuzzleHandler = require('./LogicPuzzleHandler');
var HomeworkQuizHandler = require('./HomeworkQuizHandler');

class QuestionService {
  constructor() {
    this.logicPuzzleHandler = new LogicPuzzleHandler();
    this.homeworkQuizHandler = new HomeworkQuizHandler();
  }

  operate(id, callback) {
    async.waterfall([
      (done) => {
        Paper.aggregate()
          .unwind('$sections')
          .unwind('$sections.quizzes')
          .match({'sections.quizzes._id': id})
          .exec(done);
      },
      (doc, done) => {
        Paper.populate(doc, ['sections.quizzes.quizId', 'sections.quizzes.submits'], done);
      },
      (docs, done) => {
        done(null, docs[0]);
      }, (quiz, done) => {
        const info = {};
        info.programId = quiz.programId;
        info.paperId = quiz._id;
        quiz.sections.quizzes.info = info;
        done(null, quiz.sections.quizzes);
      },
      (data, done) => {
        this.logicPuzzleHandler.handle(data, done);
      },
      (data, done) => {
        this.homeworkQuizHandler.handle(data, done);
      }
    ], callback);
  }
}

module.exports = QuestionService;
