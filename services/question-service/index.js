import async from 'async';
import Paper from '../../models/paper';
import LogicPuzzleHandler from './LogicPuzzleHandler';
import HomeworkQuizHandler from './HomeworkQuizHandler';

export default class QuestionService {
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
            .exec((err, doc) => {
              if (err) {
                return callback(err, null);
              }
              Paper.populate(doc, {path: 'sections.quizzes.quizId'}, (err, docs) => {
                done(err, docs);
              });
            });
      }, (quizInfo, done) => {
        const quiz = quizInfo[0].sections.quizzes.quizId;
        const info = {};
        info.programId = quizInfo[0].programId;
        info.paperId = quizInfo[0].paperId;
        const quizInfoObj = Object.assign({info}, {quiz});
        done(null, quizInfoObj);
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
