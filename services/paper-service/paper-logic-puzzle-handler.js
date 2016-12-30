import PaperLogicPuzzle from '../../models/paper-logic-puzzle';
import async from 'async';
import request from 'superagent';
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
}
