"use strict";

var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');
var async = require('async');
var PaperDefinition = require('../models/paper-definition');

function ProgramPaperController() {

}

ProgramPaperController.prototype.getPaper = (req, res, next) => {
  var programId = req.params.programId;
  var paperId = req.params.paperId;
  console.log(programId + "  " + paperId);
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
    isDeleted: false,
    uri: "",
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

ProgramPaperController.prototype.updatePaper = (req, res) => {
  var programId = req.params.programId;
  var paperId = req.params.paperId;
  var updateTime = new Date().toDateString();

  var {title, description, sections, isDistribution} = req.body;
  PaperDefinition.update({programId, _id: paperId},
    {$set: {programId, updateTime, title, description, isDistribution, sections}}, (err)=> {
      if (!err) {
        res.sendStatus(204);
      } else {
        res.sendStatus(400);
      }
    });
};

ProgramPaperController.prototype.deletePaper = (req, res) => {
  var programId = req.params.programId;
  var paperId = req.params.paperId;

  PaperDefinition.update({programId, _id: paperId}, {$set: {isDeleted: true}}, (err) => {
    if (!err) {
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  });
};

ProgramPaperController.prototype.distributionPaper = (req, res) => {
  var programId = req.params.programId;
  var paperId = req.params.paperId;
  var uri;

  async.waterfall([
    (done) => {
      PaperDefinition.find({programId, _id: paperId}, done);
    },

    (paper, done) => {
      if (!paper) {
        done(true, null);
      }
      apiRequest.post('/distributionPaper', paper, done)
    },

    (result, done) => {
      if(result.statusCode === 400){
        done(true, null);
      }
      uri = result.uri;
      PaperDefinition.update({programId, _id: paperId}, {$set: {isDistribution: true}}, done);
    },

    (err) => {
      if(!err){
        res.status(204).send({uri});
      }else{
        res.sendStatus(400);
      }
    }
  ]);
};

ProgramPaperController.prototype.getPaperList = (req,res,next) => {
    let pageCount = req.query.pageCount;
    let page = req.query.page;
    let skipCount = pageCount*(page-1);


    PaperDefinition.find({isDeleted:false}).limit(Number(pageCount)).select({title:1,_id:1}).skip(skipCount).exec((err,data)=>{
        if(!err && data){
            if(data.length < pageCount){
                res.status(202).send(data); //返回数据数量小于请求数量
            }
            res.status(200).send(data);
        } else {
            res.sendStatus(404);
        }
    })
};

ProgramPaperController.prototype.selectPaper = (req,res,next)=>{
    var type = req.query.type;
    let pageCount = req.query.pageCount;
    let page = req.query.page;
    let skipCount = pageCount * (page - 1);

    PaperDefinition.find({isDeleted:false,type:type}).limit(Number(pageCount)).select({title:1,_id:1}).skip(skipCount).exec((err,data)=>{
        if(!err && data){
            if(data.length < pageCount){
                res.status(202).send(data); //返回数据数量小于请求数量
            }else {
                res.status(200).send(data);
            }
        } else {
            res.sendStatus(404);
        }
    })

};



module.exports = ProgramPaperController;




