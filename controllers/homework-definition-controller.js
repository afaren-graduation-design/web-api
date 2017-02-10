'use strict';

var HomeworkDefinition = require('../models/homework-definition');
var apiRequest = require('../services/api-request');
var unique = require('../tool/unique');
var addMakerName = require('../tool/addMakerName');
var os = require('os');
var mv = require('mv');
var path = require('path');
var request = require('superagent');
var async = require('async');
var constant = require('../mixin/constant');
var HomeworkDefinitionService = require('../services/homework-definition-service/HomeworkDefinitionService');
const homeworkDefService = new HomeworkDefinitionService();

function HomeworkDefinitionController() {
}

HomeworkDefinitionController.prototype.getHomeworkList = (req, res, next) => {
  let pageCount = req.query.pageCount || 10;
  let page = req.query.page || 1;
  let order = req.query.order || '1';
  let sort = req.query.sort || 'createTime';

  homeworkDefService.getHomeworkList({pageCount, page, order, sort}, (err, data) => {
    if (err) {
      return next(err);
    }
    res.status(constant.httpCode.OK).send(data);
  });
};

HomeworkDefinitionController.prototype.matchHomework = (req, res) => {
  let pageCount = req.query.pageCount || 10;
  let page = req.query.page || 1;
  let skipCount = pageCount * (page - 1);
  let name = req.query.name;
  let homeworks;
  HomeworkDefinition.find({name, isDeleted: false}).limit(Number(pageCount))
    .skip(skipCount).exec((err, data) => {
    HomeworkDefinition.count({isDeleted: false}, (error, count) => {
      if (!err && !error && count && data) {
        let totalPage = Math.ceil(count / pageCount);
        let ids = data.map((homework) => {
          return homework.makerId;
        });
        let id = unique(ids);
        apiRequest.get('users/' + id + '/detail', (err, resp) => {
          if (!err && resp) {
            homeworks = addMakerName(resp, data);

            return res.status(constant.httpCode.OK).send({data: homeworks, totalPage});
          } else {
            res.sendStatus(constant.httpCode.NOT_FOUND);
          }
        });
      } else {
        res.sendStatus(constant.httpCode.NOT_FOUND);
      }
    });
  });
};

HomeworkDefinitionController.prototype.getOneHomework = (req, res) => {
  const homeworkId = req.params.homeworkId;
  HomeworkDefinition.findOne({_id: homeworkId, isDeleted: false}, (err, homework) => {
    if (!err && homework) {
      res.send(homework);
    } else {
      res.sendStatus(constant.httpCode.BAD_REQUEST);
    }
  });
};

HomeworkDefinitionController.prototype.deleteHomework = (req, res) => {
  const homeworkId = req.params.homeworkId;
  HomeworkDefinition.update({_id: homeworkId, isDeleted: false}, {$set: {isDeleted: true}}, (err) => {
    if (!err) {
      res.sendStatus(constant.httpCode.NO_CONTENT);
    } else {
      res.sendStatus(constant.httpCode.BAD_REQUEST);
    }
  });
};

HomeworkDefinitionController.prototype.insertEvaluateScript = (req, res) => {
  res.send(req.file);
};

HomeworkDefinitionController.prototype.deleteSomeHomeworks = (req, res) => {
  var idArray = req.body.idArray;
  HomeworkDefinition.update({
    _id: {$in: idArray},
    isDeleted: false
  }, {isDeleted: true}, {multi: true}).exec((err, data) => {
    if (!err && data) {
      res.status(constant.httpCode.NO_CONTENT).end();
    } else {
      res.status(constant.httpCode.BAD_REQUEST).end();
    }
  });
};

HomeworkDefinitionController.prototype.saveHomework = (req, res, next) => {
  const id = req.params.dataId;
  const files = req.files;
  const condition = Object.assign({}, req.body, {id: id}, files, {status: parseInt(req.body.status)});
  homeworkDefService.save(condition, (err) => {
    return err ? next(err) : res.sendStatus(constant.httpCode.NO_CONTENT)
  });
};

HomeworkDefinitionController.prototype.searchStatus = (req, res) => {
  let {id} = req.params;
  HomeworkDefinition.findOne({_id: id}).exec((err, data) => {
    if (!err && data) {
      res.status(constant.httpCode.OK).send({data: data.toJSON()});
    } else {
      res.status(constant.httpCode.NOT_FOUND).send({status: 0});
    }
  });
};

HomeworkDefinitionController.prototype.updateHomework = (req, res) => {
  const {name, stackId, definitionRepo} = req.body;
  const homeworkId = req.params.homeworkId;

  async.waterfall([
    (done) => {
      HomeworkDefinition.update({_id: homeworkId}, {$set: {name, stackId, definitionRepo, status: 1}}, (err, data) => {
        done(err, data);
      });
    },
    (data, done) => {
      res.sendStatus(constant.httpCode.NO_CONTENT);
      let callbackUrl = `${getIp()}/api/homeworkDefinitions/${homeworkId}/status`;
      request
        .post('http://10.205.125.61:9090/job/ADD_HOMEWORK/buildWithParameters')
        .send({git: definitionRepo, callback_url: callbackUrl})
        .type('form')
        .end((err, resp) => {
          if (err) {
            done(err, resp);
          }
        });
    }
  ], (err, data) => {
    HomeworkDefinition.update({_id: homeworkId}, {$set: {status: 0}}).exec((err) => {
      if (err) {
        throw err;
      }
    });
    if (err) {
      res.sendStatus(constant.httpCode.BAD_REQUEST);
      throw err;
    }
  });
};

HomeworkDefinitionController.prototype.insertHomework = (req, res, next) => {
  homeworkDefService.create(req.body, (err, data) => {
    if (err) return next(err);
    res.status(constant.httpCode.CREATED).send(data);
  })
};

module.exports = HomeworkDefinitionController;
