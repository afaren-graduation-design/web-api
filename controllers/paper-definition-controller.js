'use strict';

var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');
var PaperDefinition = require('../models/paper-definition');
var unique = require('../tool/unique');
var addMakerName = require('../tool/addMakerName');
var formatSections = require('../tool/format-sections');

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
  var updateTime = createTime;
  var {paperName, description, sections} = req.body;
  new PaperDefinition({
    programId,
    isDistribution: false,
    makerId: 1,
    description,
    paperName,
    createTime,
    updateTime,
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

  var {paperName, description, sections} = req.body;
  PaperDefinition.update({programId, _id: paperId},
    {$set: {programId, updateTime, paperName, description, sections}}, (err) => {
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

ProgramPaperController.prototype.selectPaper = (req, res, next) => {
  var paperName = req.query.title;
  let pageCount = req.query.pageCount;
  let page = req.query.page;
  let skipCount = pageCount * (page - 1);
  let papers;

  PaperDefinition.find({isDeleted: false, paperName}).limit(Number(pageCount)).skip(skipCount).exec((err, data) => {
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

ProgramPaperController.prototype.deleteSomePapers = (req, res) => {
  var idArray = req.body.idArray;
  PaperDefinition.update({_id: {$in: idArray}}, {isDeleted: true}, {multi: true}).exec((err, data) => {
    if (!err && data) {
      res.status(204).end();
    } else {
      res.status(400).end();
    }
  });
};

ProgramPaperController.prototype.distributePaper = (req, res) => {
  var {paperName, description, sections} = req.body;
  var programId = req.params.programId;
  // var makerId = req.session.use.id;
  var makerId = '1';
  var createTime = new Date().toDateString();
  var data;
  new PaperDefinition({
    programId,
    uri: '',
    paperName,
    description,
    sections,
    makerId,
    isDistribution: false,
    createTime,
    updateTime: '',
    isDeleted: false
  }).save((err, paper) => {
    if (err) {
      return res.sendStatus(400);
    }
    var formattedSections = formatSections(sections);
    data = {
      makerId, programId, paperName, sections: formattedSections
    };
    apiRequest.post('papers', data, (error, resp) => {
      if (!error && resp) {
        PaperDefinition.update({_id: paper._id}, {uri: resp.body.uri, isDistribution: true}, (err) => {
          if (!err) {
            var uri = resp.body.uri;
            return res.status(201).send(uri);
          }
          return res.sendStatus(401);
        });
      } else {
        return res.sendStatus(402);
      }
    });
  });
};

ProgramPaperController.prototype.distributePaperById = (req, res) => {
  var {paperName, description, sections} = req.body;
  var programId = req.params.programId;
  var paperId = req.params.paperId;
  // var makerId = req.session.use.id;
  var makerId = '1';
  var updateTime = new Date().toDateString();
  var data;
  PaperDefinition.update({_id: paperId, programId, isDeleted: false},
    {paperName, description, sections, updateTime}, (err) => {
      if (err) {
        return res.sendStatus(400);
      }
      var formattedSections = formatSections(sections);
      data = {
        makerId, programId, paperName, sections: formattedSections
      };
      apiRequest.post('papers', data, (error, resp) => {
        if (!error && resp) {
          PaperDefinition.update({_id: paperId}, {uri: resp.body.uri, isDistribution: true}, (err) => {
            if (!err) {
              var uri = resp.body.uri;
              return res.status(201).send(uri);
            }
            return res.sendStatus(400);
          });
        } else {
          return res.sendStatus(400);
        }
      });
    });
};

module.exports = ProgramPaperController;
