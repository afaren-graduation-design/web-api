import PaperLogicPuzzle from '../../models/paper-logic-puzzle';
import async from 'async';
import request from 'superagent';
import constant from '../../mixin/constant';
const _timeBase = 90;

export default class PaperLogicHandler {
  bulkFindOrCreate(section, callback) {
    async.waterfall([
      (done) => {
        request.get(`http://localhost:8080/paper-api/${section.quizzes[0].items_uri}`, done);
      },
      (resp, done) => {
        async.map(resp.body.quizItems, (quiz, cb) => {
          PaperLogicPuzzle.findOrCreate({id: quiz.id}, quiz, (err, doc) => {
            cb(err, {id: doc.toJSON()._id, submit: []});
          });
        }, done);
      }
    ], (err, result) => {
      if (err) {
        throw err;
      } else {
        callback(null, {type: 'logicPuzzle', items: result});
      }
    });
  }

  getStatus(section, callback) {
    let result = {type: section.type, sectionId: section._id, firstQuizId: section.items[0].id};
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
