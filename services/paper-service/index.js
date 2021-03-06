var apiRequest = require('../../services/api-request');
var async = require('async');
var Paper = require('../../models/paper');
var LogicPuzzleHandler = require('./paper-logic-puzzle-handler');
var HomeworkQuizHandler = require('./paper-homework-quiz-handler');

const handlerMap = {
  'blankQuizzes': new LogicPuzzleHandler(),
  'homeworkQuizzes': new HomeworkQuizHandler()
};

const handleSection = {
  'LogicPuzzle': new LogicPuzzleHandler(),
  'HomeworkQuiz': new HomeworkQuizHandler()
};

class PaperService {
  retrieve(condition, cb) {
    async.waterfall([
      (done) => {
        Paper.findOne(condition, done);
      },
      (doc, done) => {
        doc ? done(!!doc, doc) : done(null, doc);
      },
      (doc, done) => {
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
          return {quizzes: item};
        });
        paper.save(done);
      }
    ], (err, doc) => {
      if (err === true) {
        return cb(null, {id: doc._id + ''});
      }
      if (!err && doc) {
        return cb(null, {id: doc._id + ''});
      }
      return cb(err, null);
    });
  }

  getSection(condition, cb) {
    async.waterfall([
      (done) => {
        Paper
          .findOne(condition)
          .populate('sections.quizzes.quizId')
          .exec(done);
      },
      (docs, done) => {
        let sections = docs.toJSON().sections;
        async.map(sections, (section, callback) => {
          handleSection[section.quizzes[0].quizId.__t].getStatus(section, callback);
        }, done);
      }
    ], (err, result) => {
      cb(err, result);
    });
  }

  getQuestionIds(sectionId, cb) {
    async.waterfall([
      (done) => {
        Paper
          .findOne({'sections._id': sectionId})
          .populate(['sections.quizzes.quizId', 'sections.quizzes.submits'])
          .exec(done)
      },
      (docs, done) => {
        const section = docs.sections.find((section) => section._id + '' === sectionId);
        handleSection[section.quizzes[0].quizId.__t].getIds(section, done)
      }
    ], (err, result) => {
      cb(err, result);
    })
  }
}

module.exports = PaperService;
