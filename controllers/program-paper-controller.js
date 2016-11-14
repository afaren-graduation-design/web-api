var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');
var async = require('async');
var ProgramPaper = require('../models/program-paper');

function ProgramPaperController() {

}

ProgramPaperController.prototype.getPaper = (req, res, next) => {
  var programId = req.params.programId;
  var paperId = req.params.paperId;

  var paperUrl = 'program/' + programId + '/paper/' + paperId;

  apiRequest.get(paperUrl, (err, resp) => {
    if (!err && resp) {
      res.status(200).send(resp.body)

    } else {
      // res.status(constant.httpCode.NOT_FOUND).send("NOT_FOUND");
      next();
    }
  })
};

ProgramPaperController.prototype.savePaper = (req, res, next) => {
  var programId = req.params.programId;
  var makerId = req.session.user.id;
  var title = req.body.title;
  var description = req.body.description;
  var section = req.body.section;
  var logicSections = {};
  var homeworkSections = {};
  var createTime = new Date();

  section.map(({title, description, type, quizzes}) => {
    if (type === 'logicQuizzes') {
      async.series([
        (done) => {
          apiRequest.post('logicQuizzes', quizzes, (err, data) => {
            if (err) {
              return res.sendStatus(400);
            }
            logicSections.quizzes = data;
          }, done);
        }
      ]);
      logicSections.title = title;
      logicSections.description = description;
      logicSections.type = type;
    } else {
      async.series([
        (done) => {
          apiRequest.post('homeworkQuizzes', quizzes, (err, data) => {
            if (err) {
              return res.sendStatus(400);
            }
            homeworkSections.quizees = data;
          }, done);
        }
      ]);
      homeworkSections.title = title;
      homeworkSections.description = description;
      homeworkSections.type = type;
    }
  });

  new ProgramPaper({
    title,
    description,
    makerId,
    programId,
    createTime,
    logicSections,
    homeworkSections
  }).save(function (err, data) {
    if(err){
      return res.sendStatus(400);
    }
    var paperId = data.paperId;
    var uri = 'program/' + programId + '/paper/' + paperId;
    res.status(201).send({uri});
  })
};

module.exports = ProgramPaperController;