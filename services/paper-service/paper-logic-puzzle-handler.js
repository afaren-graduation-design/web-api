import {QuizItem} from '../../models/quizItem';
import async from 'async';
import request from 'superagent';
import constant from '../../mixin/constant';
const _timeBase = 90;

export default class PaperLogicHandler {
  bulkFindOrCreate(section, callback) {
    async.waterfall([
      (done) => {
        request.get('http://localhost:8080/paper-api/quizItems/examples', done);
      },
      (resp, done) => {
        async.map(resp.body.items, (example, cb) => {
          QuizItem.findOrCreateLogic({id: example.id}, {
            question: example.questionZh,
            description: example.descriptionZh,
            id: example.id,
            chartPath: example.chartPath,
            initializedBox: example.initializedBox,
            answer: example.answer
          }, (err, doc) => {
            cb(err, {quizId: doc.toJSON()._id});
          });
        }, done);
      },
      (examples, done) => {
        request.get(`http://localhost:8080/paper-api/${section.quizzes[0].items_uri}`, (err, resp) => {
          done(err, examples, resp);
        });
      },
      (examples, resp, done) => {
        async.map(resp.body.quizItems, (quiz, cb) => {
          QuizItem.findOrCreateLogic({id: quiz.id}, {
            question: quiz.question,
            description: quiz.description,
            id: quiz.id,
            chartPath: quiz.chartPath,
            initializedBox: quiz.initializedBox,
            answer: ''
          }, (err, doc) => {
            cb(err, {quizId: doc.toJSON()._id});
          });
        }, (err, result) => {
          const data = examples.concat(result);
          done(err, data);
        });
      }
    ], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

  getStatus(section, callback) {
    let result = {type: 'LogicPuzzle', sectionId: section._id, firstQuizId: section.quizzes[0]._id};
    if (!section.startTime) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.NOTSTART}));
    }
    let TOTAL_TIME = _timeBase * constant.time.MINUTE_PER_HOUR;
    let startTime = section.startTime || Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
    let now = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
    let usedTime = now - startTime;
    if (section.endTime) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.COMPLETE}));
    }
    if (parseInt(TOTAL_TIME - usedTime) <= 0) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.TIMEOUT}));
    }
    return callback(null, Object.assign({}, result, {status: constant.sectionStatus.INCOMPLETE}));
  }
}
