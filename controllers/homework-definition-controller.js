'use strict';

var HomeworkDefinition = require('../models/homework-definition');
var apiRequest = require('../services/api-request');
var unique = require('../tool/unique');
var addMakerName = require('../tool/addMakerName');
var os = require('os');
var request = require('superagent');
var constant = require('../mixin/constant');
var async = require('async');

function HomeworkDefinitionController() {
};

HomeworkDefinitionController.prototype.getHomeworkList = (req, res) => {
  let pageCount = req.query.pageCount || 10;
  let page = req.query.page || 1;
  let skipCount = pageCount * (page - 1);
  let homeworks;
  HomeworkDefinition.find({isDeleted: false}).limit(Number(pageCount)).skip(skipCount).exec((err, data) => {
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
            if (page === totalPage) {
              return res.status(202).send({data: homeworks, totalPage});
            }
            return res.status(200).send({data: homeworks, totalPage});
          }
          return res.sendStatus(404);
        });
      } else {
        return res.sendStatus(404);
      }
    });
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
              if (page === totalPage) {
                return res.status(202).send({data: homeworks, totalPage});
              }
              return res.status(200).send({data: homeworks, totalPage});
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

HomeworkDefinitionController.prototype.getOneHomework = (req, res) => {
  const homeworkId = req.params.homeworkId;
  HomeworkDefinition.findOne({_id: homeworkId, isDeleted: false}, (err, homework) => {
    if (!err && homework) {
      res.send(homework);
    } else {
      res.sendStatus(400);
    }
  });
};

HomeworkDefinitionController.prototype.deleteHomework = (req, res) => {
  const homeworkId = req.params.homeworkId;
  HomeworkDefinition.update({_id: homeworkId, isDeleted: false}, {$set: {isDeleted: true}}, (err) => {
    if (!err) {
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  });
};

HomeworkDefinitionController.prototype.insertEvaluateScript = (req, res) => {
  res.send(req.file);
};

HomeworkDefinitionController.prototype.deleteSomeHomeworks = (req, res) => {
  var idArray = req.body.idArray;
  HomeworkDefinition.update({_id: {$in: idArray}, isDeleted: false}, {isDeleted: true}, {multi: true}).exec((err, data) => {
    if (!err && data) {
      res.status(204).end();
    } else {
      res.status(400).end();
    }
  });
};

HomeworkDefinitionController.prototype.saveHomework = (req, res) => {
  var id = req.params.dataId;
  var {description, status, result} = req.body;
  var createTime = parseInt(new Date().getTime()) /
    (constant.time.SECONDS_PER_MINUTE *
    constant.time.MINUTE_PER_HOUR *
    constant.time.HOURS_PER_DAY *
    constant.time.MILLISECOND_PER_SECONDS);
  var templateUrl = req.file ? `./${req.file.path}` : '';
  if(status === 2) {
    apiRequest.post('homeworkQuizzes', {
      'description': 'zhangpei',
      'makerId': 1,
      'createTime': 1111111,
      'evaluateScript': '/homework-script/check-readme.sh',
      'templateRepository': 'https://github.com/sialvsic/thousands_separators.git',
      'homeworkName': 'homework name'
    }, (err, resp) => {
      if (!err && resp) {
        HomeworkDefinition.update({_id: id}, {
          $set: {
            status,
            makerId: 1,
            description,
            isDeleted: false,
            uri: resp.body.uri,
            createTime,
            evaluateScript: '',
            templateUrl,
            result
          }
        }).exec((err, data) => {
          if (!err && data) {
            res.sendStatus(200);
          } else {
            res.sendStatus(403);
          }
        });
      } else {
        res.sendStatus(403);
      }
    })
  } else {
    HomeworkDefinition.update({_id: id}, {
      $set: {
        status,
        makerId: 1,
        description,
        isDeleted: false,
        uri: '',
        createTime,
        evaluateScript: '',
        templateUrl,
        result
      }
    }).exec((err, data) => {
      if (!err && data) {
        res.sendStatus(200);
      } else {
        res.sendStatus(403);
      }
    });
  }
};

HomeworkDefinitionController.prototype.searchStatus = (req, res) => {
  let {id} = req.params;
  HomeworkDefinition.findOne({_id: id}).exec((err, data) => {
    if (!err && data) {
      res.status(200).send({data: data.toJSON()});
    } else {
      res.status(404).send({status: 0});
    }
  });
};

HomeworkDefinitionController.prototype.updateHomework = (req, res) => {
  const {name, type, definitionRepo} = req.body;
  const homeworkId = req.params.homeworkId;
  HomeworkDefinition.update({_id: homeworkId}, {$set: {name, type, definitionRepo}}, (err, data) => {
    if (!err && data) {
      var callbackUrl = `${getIp()}/api/homeworkDefinitions/jenkinsReaction/${homeworkId}`;
      request
        .post('http://192.168.10.54:9090/job/ADD_HOMEWORK/buildWithParameters')
        .send({
          git: definitionRepo,
          callback_url: callbackUrl
        })
        .type('form')
        .end((err, resp) => {
          if (!err) {
            resp.sendStatus(200);
          } else {
            HomeworkDefinition.update({_id: data._id}, {$set: {status: 0}}).exec((err, data) => {
              resp.sendStatus(404);
              if (err) {
                throw err;
              }
            });
          }
        });
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  });
};

HomeworkDefinitionController.prototype.insertHomework = (req, res) => {
  const {name, type, definitionRepo} = req.body;

  async.waterfall([
    (done) => {
      new HomeworkDefinition({
        name,
        type,
        definitionRepo,
        status: 1
      }).save((err, data) => {
        if (!err && data) {
          var callbackUrl = `${getIp()}/api/homeworkDefinitions/jenkinsReaction/${data._id}`;
          res.status(200).send({id: data._id});
          request
            .post('http://192.168.10.54:9090/job/ADD_HOMEWORK/buildWithParameters')
            .send({
              git: definitionRepo,
              callback_url: callbackUrl
            })
            .type('form')
            .end((err, resp) => {
              if (!err) {
                resp.sendStatus(200);
              } else {
                HomeworkDefinition.update({_id: data._id}, {$set: {status: 0}}).exec((err, data) => {
                  resp.sendStatus(404);
                  if (err) {
                    throw err;
                  }
                });
              }
            });
        } else {
          if (err.code === 11000) {
            res.sendStatus(400);
          }
          done(err);
        }
      });
    }], (err) => {
    res.status(403).send({status: 0});
    if (err) {
      throw err;
    }
  });
};

function getIp() {
  var interfaces = os.networkInterfaces();
  var addresses = [];

  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }

  return addresses[0];
}

module.exports = HomeworkDefinitionController;
