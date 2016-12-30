import apiRequest from '../../services/api-request';
import async from 'async';
import Paper from '../../models/Paper';
import LogicPuzzleHandler from './paper-logic-puzzle-handler';
import HomeworkQuizHandler from './paper-homework-quiz-handler';
const handlerMap = {
  'blankQuizzes': new LogicPuzzleHandler(),
  'homeworkQuizzes': new HomeworkQuizHandler()
};

export default class PaperService {
  retrieve(condition, cb) {
    async.waterfall([
      (done) => {
        Paper.findOne(condition, done);
      },
      (doc, done) => {
        done(doc);
      },
      (done) => {
        let pathUri = `programs/${condition.programId}/papers/${condition.paperId}`;
        apiRequest.get(pathUri, done);
      },
      (resp, done) => {
        async.map(resp.body.sections, (section, callback) => {
          handlerMap[section.sectionType].bulkFindOrCreate(section, callback);
        }, done);
      },
      (result, done) => {
        let data = Object.assign({}, {sections: result}, condition, {paperUri: `programs/${condition.programId}/papers/${condition.paperId}`});
        new Paper(data).save(done);
      }
    ], (err) => {
      if (!err || err._id) {
        cb(null, {status: 200});
      } else {
        throw err;
      }
    });
  }
}
