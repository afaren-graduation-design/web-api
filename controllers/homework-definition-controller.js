'use strict';

var HomeworkDefinition = require('../models/homework-definition');
var apiRequest = require('../services/api-request');
var unique = require('../tool/unique');
var addMakerName = require('../tool/addMakerName');
var os = require('os');
var request = require('superagent');
var async = require('async');
var constant = require('../mixin/constant');

function HomeworkDefinitionController() {
};

HomeworkDefinitionController.prototype.getHomeworkList = (req, res) => {
  let pageCount = req.query.pageCount || 10;
  let page = req.query.page || 1;
  let skipCount = pageCount * (page - 1);
  let order = req.query.order || '1';
  let sort = req.query.sort || 'createTime';
  let homeworks;
  let sortData = {};
  sortData[sort] = order;

  HomeworkDefinition.find({isDeleted: false}).sort(sortData).limit(Number(pageCount)).skip(skipCount).exec((err, data) => {
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
  HomeworkDefinition.update({
    _id: {$in: idArray},
    isDeleted: false
  }, {isDeleted: true}, {multi: true}).exec((err, data) => {
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
  var answerPath = 'test path'; // Fixme
  var evaluateScript = req.file ? `./${req.file.path}` : '';
  if (status === '2') {
    async.waterfall([
      (done) => {
        HomeworkDefinition.findOne({_id: id}, (err, doc) => {
          done(err, doc);
        });
      },
      (doc, done) => {
        apiRequest.post('homeworkQuizzes', {
          'description': description,
          'evaluateScript': evaluateScript,
          'templateRepository': '',
          'makerId': 1,
          'answerPath': answerPath,
          'createTime': createTime,
          'type': doc.toJSON().type.toString(),
          'homeworkName': doc.toJSON().name.toString()
        }, (err, resp) => {
          done(err, resp);
        });
      },
      (resp, done) => {
        HomeworkDefinition.update({_id: id}, {
          $set: {
            status,
            makerId: 1,
            description,
            isDeleted: false,
            uri: resp.body.uri,
            answerPath,
            createTime,
            evaluateScript,
            templateUrl: '',
            result
          }
        }).exec((err, doc) => {
          done(err, doc);
        });
      },
      (doc, done) => {
        res.sendStatus(200);
        done(null, null);
      }
    ], (error, result) => {
      if (error) {
        res.sendStatus(404);
        throw error;
      }
    });
  } else {
    async.waterfall([
      (done) => {
        HomeworkDefinition.update({_id: id}, {
          $set: {
            status,
            makerId: 1,
            description,
            isDeleted: false,
            uri: '',
            answerPath,
            createTime,
            evaluateScript,
            templateUrl: '',
            result
          }
        }).exec((err, doc) => {
          done(err, doc);
        });
      },
      (doc, done) => {
        res.sendStatus(200);
      }
    ], (error, result) => {
      if (error) {
        res.sendStatus(403);
        throw error;
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

  async.waterfall([
    (done) => {
      HomeworkDefinition.update({_id: homeworkId}, {$set: {name, type, definitionRepo, status: 1}}, (err, data) => {
        done(err, data);
      });
    },
    (data, done) => {
      res.sendStatus(204);
      let callbackUrl = `${getIp()}/api/homeworkDefinitions/${homeworkId}/status`;
      request
        .post('http://192.168.10.54:9090/job/ADD_HOMEWORK/buildWithParameters')
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
      res.sendStatus(400);
      throw err;
    }
  });
};

HomeworkDefinitionController.prototype.insertHomework = (req, res) => {
  const {name, type, definitionRepo} = req.body;
  let error = {};
  async.waterfall([
    (done) => {
      new HomeworkDefinition({
        name,
        type,
        definitionRepo,
        status: 1
      }).save((err, data) => {
        if (err || !data) {
          error.status = 0;
          error.err = err;
          done(error, data);
        }
        done(null, data);
      });
    }, (data, done) => {
      const callbackUrl = `${getIp()}/api/homeworkDefinitions/${data._id}/status`;
      request
        .post('http://192.168.10.54:9090/job/ADD_HOMEWORK/buildWithParameters')
        .send({
          git: definitionRepo,
          callback_url: callbackUrl
        })
        .type('form')
        .end((err, resp) => {
          if (err || !resp) {
            error.status = 1;
            error.err = err;
            done(error, data);
          }
          res.status(200).send({id: data._id});
        });
    }], (error, data) => {
    if (error.status === 1) {
      HomeworkDefinition.update({_id: data._id}, {$set: {status: 0}}).exec((err, data) => {
        if (err) {
          throw err;
        }
      });
    } else {
      if (error.err.code === 11000) {
        res.sendStatus(400);
      } else if (error) {
        res.status(403).send({status: 0});
      }
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
