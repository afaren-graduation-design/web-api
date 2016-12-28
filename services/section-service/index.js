import logicPuzzles from '../../models/logic-puzzle';
import homeworkQuizzes from '../../models/user-homework-quizzes';
import Rx from 'rx';
import HomeworkQuiz from './homework-quiz-section';
import LogicPuzzle from './logic-puzzle-section';

const classMap = {
  'LogicPuzzle': LogicPuzzle,
  'UserHomeworkQuizzes': HomeworkQuiz
};

export default class SectionService {
  getList(condition, done) {
    let logicPuzzleFind = Rx.Observable.fromPromise(logicPuzzles.find(condition));
    let homeworkQuizzesFind = Rx.Observable.fromPromise(homeworkQuizzes.find(condition));

    Rx.Observable.concat(logicPuzzleFind, homeworkQuizzesFind)
      .flatMap((x) => {
        return Rx.Observable.from(x);
      })
      .map((x) => {
        let type = x.constructor.modelName;
        return new classMap[type](x);
      })
      .map(x => x.toJSON())
      .toArray()
      .subscribe((x) => {
        done(null, x);
      }, (x) => {
        done(x);
      }, (x) => {
      });
  }
}
