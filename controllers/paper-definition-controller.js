'use strict';
var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');
var PaperDefinition = require('../models/paper-definition');
var unique = require('../tool/unique');
var addMakerName = require('../tool/addMakerName');
var formatSections = require('../tool/format-sections');

function PaperDefinitionController() {

}

PaperDefinitionController.prototype.getPaperDefinition = (req, res, next) => {
  var programId = req.params.programId;
  var paperId = req.params.paperId;
  PaperDefinition.findOne({programId, _id: paperId}, (err, data) => {
    if (!err && data) {
      res.status(200).send(data);
    } else {
      next();
    }
  });
};

PaperDefinitionController.prototype.savePaperDefinition = (req, res, next) => {
  var programId = req.params.programId;
  var makerId = req.session.user.id;
  var createTime = parseInt(new Date().getTime()) /
    (constant.time.SECONDS_PER_MINUTE *
    constant.time.MINUTE_PER_HOUR *
    constant.time.HOURS_PER_DAY *
    constant.time.MILLISECOND_PER_SECONDS);
  var updateTime = createTime;
  var {paperName, description, sections} = req.body;
  new PaperDefinition({
    programId,
    isDistribution: false,
    makerId,
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

PaperDefinitionController.prototype.updatePaperDefinition = (req, res) => {
  var programId = req.params.programId;
  var paperId = req.params.paperId;
  var updateTime = parseInt(new Date().getTime()) /
    (constant.time.SECONDS_PER_MINUTE *
    constant.time.MINUTE_PER_HOUR *
    constant.time.HOURS_PER_DAY *
    constant.time.MILLISECOND_PER_SECONDS);
  ;

  var {paperName, description, sections} = req.body.data;
  PaperDefinition.update({programId, _id: paperId},
    {$set: {programId, updateTime, paperName, description, sections}}, (err) => {
      if (!err) {
        res.sendStatus(204);
      } else {
        res.sendStatus(400);
      }
    });
};

PaperDefinitionController.prototype.deletePaperDefinition = (req, res) => {
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

PaperDefinitionController.prototype.getPaperDefinitionList = (req, res, next) => {
  let pageCount = req.query.pageCount || 10;
  let page = req.query.page || 1;
  let skipCount = pageCount * (page - 1);
  let papers;
  let order = req.query.order || '1';
  let sort = req.query.sort || 'updateTime';
  let sortData = {};
  sortData[sort] = order;

  PaperDefinition.find({isDeleted: false}).sort(sortData).limit(Number(pageCount)).skip(skipCount).exec((err, data) => {
    PaperDefinition.count({isDeleted: false}, (error, count) => {
      if (!err && !error && count && data) {
        var totalPage = Math.ceil(count / pageCount);
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

PaperDefinitionController.prototype.selectPaperDefinition = (req, res, next) => {
  var paperName = req.query.title;
  let pageCount = req.query.pageCount || 10;
  let page = req.query.page || 1;
  let skipCount = pageCount * (page - 1);
  let papers;

  PaperDefinition.find({isDeleted: false, paperName}).limit(Number(pageCount)).skip(skipCount).exec((err, data) => {
    PaperDefinition.count({isDeleted: false}, (error, count) => {
      if (!err && !error && count && data) {
        var totalPage = Math.ceil(count / pageCount);
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

PaperDefinitionController.prototype.deleteSomePaperDefinition = (req, res) => {
  var idArray = req.body.idArray;
  PaperDefinition.update({_id: {$in: idArray}}, {isDeleted: true}, {multi: true}).exec((err, data) => {
    if (!err && data) {
      res.status(204).end();
    } else {
      res.status(400).end();
    }
  });
};

PaperDefinitionController.prototype.distributePaperDefinition = (req, res) => {
  var {paperName, description, sections} = req.body.data;
  var programId = Number(req.params.programId);
  var makerId = req.session.user.id;
  var createTime = req.body.data.createTime ? req.body.data.createTime : parseInt(new Date().getTime() /
    (constant.time.SECONDS_PER_MINUTE *
    constant.time.MINUTE_PER_HOUR *
    constant.time.HOURS_PER_DAY *
    constant.time.MILLISECOND_PER_SECONDS));
  var updateTime = createTime;
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
    updateTime,
    isDeleted: false
  }).save((err, paper) => {
    if (err) {
      return res.sendStatus(400);
    }
    var formattedSections = formatSections(sections);
    data = {
      makerId, createTime, programId, paperName, description, sections: formattedSections
    };
    apiRequest.post('programs/1/papers', data, (error, resp) => {
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

PaperDefinitionController.prototype.distributePaperDefinitionById = (req, res) => {
  var {paperName, description, sections} = req.body.data;
  var programId = Number(req.params.programId);
  var paperId = req.params.paperId;
  var makerId = req.session.user.id;
  var updateTime = req.body.data.updateTime ? req.body.data.updateTime : parseInt(new Date().getTime()) /
      (constant.time.SECONDS_PER_MINUTE *
      constant.time.MINUTE_PER_HOUR *
      constant.time.HOURS_PER_DAY *
      constant.time.MILLISECOND_PER_SECONDS);
  var data;
  PaperDefinition.update({_id: paperId, programId, isDeleted: false},
    {paperName, description, sections, updateTime}, (err) => {
      if (err) {
        return res.sendStatus(400);
      }
      var formattedSections = formatSections(sections);
      data = {
        makerId, createTime: updateTime, programId, paperName, description, sections: formattedSections
      };

      apiRequest.post('programs/1/papers', data, (error, resp) => {
        if (!error && resp) {
          PaperDefinition.update({_id: paperId}, {uri: resp.body.uri, isDistribution: true}, (err) => {
            if (!err) {
              var uri = resp.body.uri;
              return res.status(204).send(uri);
            }
            return res.sendStatus(400);
          });
        } else {
          return res.sendStatus(400);
        }
      });
    });
};

module.exports = PaperDefinitionController;
