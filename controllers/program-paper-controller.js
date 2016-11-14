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
  var makerId = req.body.makerId;

  var createTime = new Date().toDateString();
  var {title, description, sections, makerId} = req.body;

  new PaperDefinition({
    programId,
    isDistribution: false,
    makerId,
    description,
    title,
    createTime,
    sections
  }).save((err, paper)=> {
    if (!err && paper) {
      res.status(201).send({
        paperId: paper._id
      });
    } else {
      res.sendStatus(constant.BAD_REQUEST);
    }
  });
};

ProgramPaperController.prototype.updatePaper = (req, res, next) => {
  var programId = req.params.programId;
  var paperId = req.params.paperId;
  var updateTime = new Date().toDateString();

  var {title, description, sections, isDistribution} = req.body;

  PaperDefinition.update({_id: paperId},
    {$set: {programId, updateTime, title, description, isDistribution, sections}}, (err, paper)=> {
      if(!err && paper){
        res.status(200).send({paperId: paper._id});
      }else{
        res.sendStatus(400);
      }
    })
};

module.exports = ProgramPaperController;