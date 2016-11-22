'use strict';

var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');
var async = require('async');
var PaperDefinition = require('../models/paper-definition');
var unique = require('../tool/unique');
var addMakerName = require('../tool/addMakerName');

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
  // var makerId = req.body.makerId;

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
    uri: '',
    sections
  }).save((err, paper) => {
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
    {$set: {programId, updateTime, title, description, isDistribution, sections}}, (err) => {
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
      apiRequest.post('distributionPaper', paper[0], done);
    },

    (result, done) => {
      if (result.statusCode === 400) {
        done(true, null);
      }
      uri = result.uri;
      PaperDefinition.update({programId, _id: paperId}, {$set: {isDistribution: true}}, (err, data) => {
        if (err) {
          done(true, null);
        }
        done(err, data);
      });
    },

    (data) => {
      if (data) {
        res.status(204).send({uri});
      } else {
        res.sendStatus(400);
      }
    }
  ]);
};

ProgramPaperController.prototype.getPaperList = (req, res, next) => {
  let pageCount = req.query.pageCount;
  let page = req.query.page;
  let skipCount = pageCount * (page - 1);
  let papers;

  PaperDefinition.find({isDeleted: false}).limit(Number(pageCount)).skip(skipCount).exec((err, data) => {
    PaperDefinition.count({isDeleted: false}, (error, count) => {
      if (!err && !error && count && data) {
        var totalPage = Math.ceil(count / 10);
        let ids = data.map((paper) => {
          return paper.makerId;
        });
        let id = unique(ids);
        apiRequest.get('users/' + id + '/detail', (err, resp) => {
          if (!err && resp) {
            papers = addMakerName(resp, data);
            if (page === totalPage) {
              res.status(202); // 返回数据数量小于请求数量
            } else {
              res.status(200);
            }
            res.send({totalPage: totalPage, data: papers});
          } else {
            res.sendStatus(404);
          }
        });
      } else {
        res.sendStatus(404);
      }
    });
  });
};

ProgramPaperController.prototype.deleteBatch = (req, res) => {
  let papersIds = req.body.papersIds;
  let status = papersIds.map((papersId) => {
    PaperDefinition.update({_id: papersId}, {$set: {isDeleted: true}}, (err) => {
      if (!err) {
        return 204;
      } else {
        return 400;
      }
    });
  });
  if (status.indexOf(400) === -1) {
    res.sendStatus(204);
  } else {
    res.sendStatus(400);
  }
};

ProgramPaperController.prototype.selectPaper = (req, res, next) => {
  var title = req.query.title;
  let pageCount = req.query.pageCount;
  let page = req.query.page;
  let skipCount = pageCount * (page - 1);
  let papers;

  PaperDefinition.find({isDeleted: false, title: title}).limit(Number(pageCount)).skip(skipCount).exec((err, data) => {
    PaperDefinition.count({isDeleted: false}, (error, count) => {
      if (!err && !error && count && data) {
        var totalPage = Math.ceil(count / 10);
        let ids = data.map((paper) => {
          return paper.makerId;
        });
        let id = unique(ids);
        apiRequest.get('users/' + id + '/detail', (err, resp) => {
          if (!err && resp) {
            papers = addMakerName(resp, data);
            if (page === totalPage) {
              res.status(202); // 返回数据数量小于请求数量
            } else {
              res.status(200);
            }
            res.send({totalPage: totalPage, data: papers});
          } else {
            res.sendStatus(404);
          }
        });
      } else {
        res.sendStatus(404);
      }
    });
  });
};

module.exports = ProgramPaperController;
