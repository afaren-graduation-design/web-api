import apiRequest from '../../services/api-request';
import async from 'async';
import Paper from '../../models/paper';
import LogicPuzzleHandler from './paper-logic-puzzle-handler';
import HomeworkQuizHandler from './paper-homework-quiz-handler';

const handlerMap = {
  'blankQuizzes': new LogicPuzzleHandler(),
  'homeworkQuizzes': new HomeworkQuizHandler()
};

const handleSection = {
  'LogicPuzzle': new LogicPuzzleHandler(),
  'HomeworkQuiz': new HomeworkQuizHandler()
};

export default class PaperService {
  retrieve(condition, cb) {
    async.waterfall([
      (done) => {
        Paper.findOne(condition, done);
      },
      (doc, done) => {
        doc ? done(!!doc, doc) : done(doc);
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
        condition.paperUri = `programs/${condition.programId}/papers/${condition.paperId}`;
        let paper = new Paper(condition);
        paper.sections = result.map((item) => {
          return {sectionItems: item};
        });
        paper.save(done);
      }
    ], (err, doc) => {
      if (err === true) {
        cb(null, {id: doc._id + ''});
      }
      if (!err && doc) {
        cb(null, {id: doc._id});
      }
      cb(err, null);
    });
  }

  getSection(condition, cb) {
    async.waterfall([
      (done) => {
        Paper
          .findOne(condition)
          .populate('sections.sectionItems')
          .exec(done);
      },
      (docs, done) => {
        let sections = docs.toJSON().sections;
        async.map(sections, (section, callback) => {
          handleSection[section.sectionItems[0].__t].getStatus(section, callback);
        }, done);
      }
    ], (err, result) => {
      cb(err, result);
    });
  }
}
