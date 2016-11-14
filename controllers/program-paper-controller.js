var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');
var PaperDefinition = require('../models/paper-definition');

function ProgramPaperController() {

}

ProgramPaperController.prototype.getPaper = (req, res, next) => {
    var programId = req.params.programId;
    var paperId = req.params.paperId;

    PaperDefinition.find({programId, _id: paperId}, (err, data) => {
        if (!err && data) {
            res.status(200).send(data);
        } else {
            next();
        }
    });
};

ProgramPaperController.prototype.savePaper = (req, res, next) => {
  var programId = req.params.programId;
  // var makerId = req.session.user.id;   //去看mocha获取用户身份的方式
    var makerId = req.body.makerId

  var createTime = new Date().toDateString();
  var {title,description,sections,makerId} = req.body;

  new PaperDefinition({
      programId,
      isDistribution:false,
      makerId,
      description,
      title,
      createTime,
      sections
  }).save((err,paper)=>{
      if( !err  && paper) {
          res.status(201).send({
              paperId:paper._id
          });
      } else {
          res.sendStatus(constant.BAD_REQUEST);
      }
  });






  // section.map(({title, description, type, quizzes}) => {
  //   if (type === 'logicQuizzes') {
  //     apiRequest.post('logicQuizzes', quizzes, (err, data) => {
  //         if (err) {
  //           return res.sendStatus(400);
  //         }
  //         logicSections.quizzes = data;
  //       }
  //     );
  //     logicSections.title = title;
  //     logicSections.description = description;
  //     logicSections.type = type;
  //   } else {
  //     apiRequest.post('homeworkQuizzes', quizzes, (err, data) => {
  //         if (err) {
  //           return res.sendStatus(400);
  //         }
  //         homeworkSections.quizzes = data;
  //       }
  //     );
  //     homeworkSections.title = title;
  //     homeworkSections.description = description;
  //     homeworkSections.type = type;
  //   }
  // });
  //
  // new ProgramPaper({
  //   title,
  //   description,
  //   makerId,
  //   programId,
  //   createTime,
  //   logicSections,
  //   homeworkSections
  // }).save(function (err, data) {
  //   if (err) {
  //     return res.sendStatus(400);
  //   }
  //   var paperId = data.paperId;
  //   var uri = 'program/' + programId + '/paper/' + paperId;
  //   res.status(201).send({uri});
  // })
};

ProgramPaperController.prototype.updatePaper = (req, res, next) => {
  var programId = req.params.programId;
  var paperId = req.params.paperId;
  var updateTime = new Date().toDateString();

  var {title, description, sections, isDistribution} = req.body;

  new PaperDefinition({
    programId,
    isDistribution,
    title,
    description,
    updateTime,
    sections
  }).save((err, paper) => {
    if(!err & paper){
      res.sendStatus(200);
    }else{
      res.sendStatus(400);
    }
  })
};

module.exports = ProgramPaperController;