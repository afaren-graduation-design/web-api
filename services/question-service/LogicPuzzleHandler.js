import async from 'async';
import yamlConfig from 'node-yaml-config';
const config = yamlConfig.load('./config/config.yml');
import OperateHandler from './OperateHandler';
import Paper from '../../models/paper';

export default class LogicPuzzleHandler extends OperateHandler {
  check(quiz) {
    return (quiz.__t === 'LogicPuzzle');
  }

  subHandle(quiz, callback) {
    async.waterfall([
      (done) => {
        Paper.aggregate()
          .unwind('$sections')
          .unwind('$sections.quizzes')
          .exec((err, doc) => {
            if (err) {
              return done(err, null);
            }
            Paper.populate(doc, {path: 'sections.quizzes.quizId'}, (err, docs) => {
              if (err) {
                return done(err, null);
              }
              const itemCount = docs.filter((item) => item.sections.quizzes.quizId.__t === 'LogicPuzzle').length;
              done(null, itemCount);
            });
          });
      },
      (data, done) => {
        const logicPuzzle = {
          item: {
            id: quiz.id,
            initializedBox: JSON.parse(quiz.initializedBox),
            question: quiz.question,
            description: JSON.parse(quiz.description),
            chartPath: config.staticFileServer + quiz.chartPath
          },
          itemCount: data
        };
        done(null, logicPuzzle);
      }
    ], callback);
  }
}
