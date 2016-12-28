var Paper = require('../../models/paper');
var PaperLogicPuzzle = require('../../models/paper-logic-puzzle');
var async = require('async');
var request = require('superagent');

const saveBlankQuiz = (quiz, callback)=> {
  async.waterfall([
    (done)=> {
      PaperLogicPuzzle.findOne({id: quiz.id}, done)
    },

    (data, done)=> {
      if (data) {
        done(null, data)
      }

      let puzzle = new PaperLogicPuzzle(quiz);

      puzzle.save((err)=> {
        let obj = Object.assign({}, puzzle.toJSON(), {
          type: 'logicPuzzle'
        });
        done(err, obj);
      })
    }
  ], callback);
};

const addBlankQuiz = (section, callback)=> {
  let {items_uri} = section.quizzes[0];

  async.waterfall([
    (done)=> {
      request(`http://localhost:8080/paper-api/${items_uri}`)
          .end((err, res)=> {
            done(err, res.body.quizItems);
          })
    },
    (quizzes, done)=> {
      async.map(quizzes, saveBlankQuiz, done)
    }
  ], (err, data)=> {
    callback(err, {
      type: 'logicPuzzle',
      items: data.map((item)=> item._id)
    });
  });
};

const defaultHandler = (section, cb)=> {
  cb(null);
};

const handlerMap = {
  blankQuizzes: addBlankQuiz,
  homeworkQuizzes: defaultHandler
};


class PaperService {

  addPaperForUser({paperName, id, programId, userId, sections}, cb) {

    async.waterfall([
      (done)=> {
        let paperData = {
          programId,
          paperId: id,
          userId
        };
        Paper.findOrCreate(paperData, done)
      },

      (paper, done)=> {
        async.map(sections, this.addSection, (err, results)=> {
          paper.sections = paper.sections || [];

          results.forEach((item)=> {
            if(!item) {return}
            paper.sections.push(item)
          });
          // console.log(paper);
          done(null, paper)
        })
      },

      (paper, done)=> {
        paper.save((err)=> {
          done(err, paper)
        })
      }
    ], cb);
  }

  addSection(section, cb) {
    const handleFunc = handlerMap[section.sectionType] || defaultHandler;
    handleFunc(section, (err, results)=> {
      cb(err, results);
    });
  }
}

module.exports = PaperService;