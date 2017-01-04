import apiRequest from '../../services/api-request';
import async from 'async';
import Paper from '../../models/paper';
import LogicPuzzleHandler from './paper-logic-puzzle-handler';
import HomeworkQuizHandler from './paper-homework-quiz-handler';
import LogicPuzzleSectionService from './logic-puzzle-section-service';
import HomeWorkQuizSectionService from './homework-quiz-section-service';
const handlerMap = {
  'blankQuizzes': new LogicPuzzleHandler(),
  'homeworkQuizzes': new HomeworkQuizHandler()
};

const handleSection = {
  'logicPuzzle': new LogicPuzzleSectionService(),
  'homeworkQuiz': new HomeWorkQuizSectionService()
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

  getSection(condition, cb) {
    async.waterfall([
      (done) => {
        Paper.findOne(condition, done);
      },
      (docs, done) => {
        let sections = docs.toJSON().sections;
        async.map(sections, (section, callback) => {
          handleSection[section.type].getStatus(section, callback);
        }, done);
      },
      (result, done) => {
        done(null, result.map((item, index) => {
          let preSection = result[index - 1] || {status: 1};
          let preStatus = preSection.status;

          let status = (item.status === 0 || item.status === 3) && (preStatus === 1 || preStatus === 2);
          return Object.assign({}, item, {status});
        })
        );
      }
    ], (err, result) => {
      cb(err, result);
    });
  }
}
