import async from 'async';
import Paper  from '../../models/paper';
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
              Paper.populate(doc, {path: 'sections.quizzes.quizId'}, (err, docs) => {
                const quiz = docs[0].sections.quizzes.quizId;
                done(err, quiz);
              });
            });
      },
      (data, done) => {
          this.logicPuzzleHandler.handle(data,done);
      },
      (data, done) => {
       this.homeworkQuizHandler.handle(data,done);
      }
    ], callback)
  }
}
