const Paper = require('../../models/paper');
const PaperLogicPuzzle = require('../../models/paper-logic-puzzle');
const async = require('async');
const request = require('superagent');
const apiRequest = require('../api-request');
const PaperHomeworkQuiz = require('../../models/paper-homework-quiz');
const PaperLogicPuzzleHandler = require('./paper-logic-puzzle-handler');
const saveBlankQuiz = (quiz, callback) => {
  async.waterfall([
    (done) => {
      PaperLogicPuzzle.findOne({id: quiz.id}, done);
    },
    (data, done) => {
      if (data) {
        done(null, data);
      }

      let puzzle = new PaperLogicPuzzle(quiz);

      puzzle.save((err) => {
        let obj = Object.assign({}, puzzle.toJSON(), {
          type: 'logicPuzzle'
        });
        done(err, obj);
      });
    }
  ], callback);
};

const addBlankQuiz = (section, callback) => {
  let {items_uri} = section.quizzes[0];
  async.waterfall([
    (done) => {
      request(`http://localhost:8080/paper-api/${items_uri}`) //eslint-disable-line
        .end((err, res) => {
          done(err, res.body.quizItems);
        });
    },
    (quizzes, done) => {
      async.map(quizzes, saveBlankQuiz, done);
    }
  ], (err, data) => {
    callback(err, {
      type: 'logicPuzzle',
      items: data.map((item) => item._id)
    });
  });
};

const defaultHandler = (section, cb) => {
  cb(null);
};

const handlerMap = {
  blankQuizzes: new PaperLogicPuzzleHandler(),
  homeworkQuizzes: defaultHandler
};

class PaperService {


  retrieve({programId, paperId, userId}, cb) {
    let paperUri = `programs/${programId}/papers/${paperId}`;

    async.waterfall([
      (done) => {
        Paper.findOne({programId, paperId, userId}, done);
      },
      (doc, done) => {
        if (!doc) {
          apiRequest.get(paperUri, done)
        } else {
          done({msg: 'paper exist'});
        }
      },
      (data,done)=>{
        async.map(data.body.sections, (section, callback) => {
          handlerMap[section.sectionType].bulkFindOrCreate(section, callback)
        },done)
      },
      (sections, done) => {
        new Paper({programId, paperId, userId, sections}).save(done);
      }
    ], (err) => {
      if (err) {
        if (err.msg === 'paper exist') {
          cb(null, {msg: err.msg})
        }
        throw err;
      } else {
        cb(null, {msg: 'success'})
      }


    })

  }

  addPaperForUser({paperName, id, programId, userId, sections}, cb) {
    async.waterfall([
      (done) => {
        let paperData = {
          programId,
          paperId: id,
          userId
        };
        Paper.findOrCreate(paperData, done);
      },

      (paper, done) => {
        async.map(sections, this.addSection, (err, results) => {
          if (err) {
            throw err;
          }
          paper.sections = paper.sections || [];

          results.forEach((item) => {
            if (!item) {
              return;
            }
            paper.sections.push(item);
          });
          done(null, paper);
        });
      },

      (paper, done) => {
        paper.save((err) => {
          done(err, paper);
        });
      }
    ], cb);
  }

  addSection(section, cb) {
    const handleFunc = handlerMap[section.sectionType] || defaultHandler;
    handleFunc(section, (err, results) => {
      cb(err, results);
    });
  }
}

module.exports = PaperService; //eslint-disable-line