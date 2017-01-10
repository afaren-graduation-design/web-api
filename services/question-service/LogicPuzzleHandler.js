import async from 'async';
import  OperateHandler from './OperateHandler';
import  Paper from '../../models/paper';

export default class LogicPuzzleHandler extends OperateHandler {
  check(quiz) {
    return (quiz.__t === 'LogicPuzzle');
  }

  subHandle(quiz, callback) {
    async.waterfall([
      (done)=> {
        Paper.aggregate()
            .unwind('$sections')
            .unwind('$sections.quizzes')
            .exec((err, doc) => {
              Paper.populate(doc, {path: 'sections.quizzes.quizId'}, (err, docs) => {
               const itemCount = docs.filter((item)=> item.sections.quizzes.quizId.__t === 'LogicPuzzle').length;
                done(null, itemCount);
              })
            });
      },
      (data, done) => {
        const logicPuzzle = {
          item: {
            id: quiz.id,
            initializedBox: quiz.initializedBox,
            question: quiz.question,
            description: quiz.description,
            chartPath: quiz.chartPath
          },
          itemCount:data
        };
        done(null,logicPuzzle);
      }
    ],callback);


    // return callback(null, logicPuzzle);
  }
}