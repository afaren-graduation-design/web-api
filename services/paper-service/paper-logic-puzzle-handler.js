import async from 'async';
import PaperLogicPuzzle from '../../models/paper-logic-puzzle';
export default class PaperLogicPuzzleHandler {
  bulkFindOrCreate(section, callback) {
    let pathUrl = section.quizzes[0].items_uri
    async.waterfall([
      (done) => {
        request
          .get(`http://localhost:8080/paper-api/${pathUrl}`)
          .end(done)
      },
      (resp, done) => {
        async.map(resp.body.quizItems, PaperLogicPuzzle.findOrCreate, done)
      },
      (docs, done) => {
        const result = {
          type: 'logicPuzzle',
          items: docs.map(doc => ({
            id: doc._id,
            submits: []
          }))
        }
        done(null, result)
      }
    ], callback)
  }
}
