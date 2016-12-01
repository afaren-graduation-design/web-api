'use strict';

var HomeworkDefinition = require('../models/homework-definition');
var apiRequest = require('../services/api-request');
var unique = require('../tool/unique');
var addMakerName = require('../tool/addMakerName');
// var request = require('superagent');
// var yamlConfig = require('node-yaml-config');

// var taskApi = yamlConfig.load(__dirname + '/../config/config.yml').taskApi;

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

HomeworkDefinitionController.prototype.updateHomework = (req, res) => {
  const {name, type, definitionRepo} = req.body;
  const homeworkId = req.params.homeworkId;
  HomeworkDefinition.update({_id: homeworkId, isDeleted: false}, {$set: {name, type, definitionRepo}}, (err) => {
    if (!err) {
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
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

HomeworkDefinitionController.prototype.insertHomework = (req, res) => {
  const {name, type, definitionRepo} = req.body;
  var createTime = new Date().toDateString();
  //   var interfaces = os.networkInterfaces();
  //   var addresses = [];
  //   for (var k in interfaces) {
  //       for (var k2 in interfaces[k]) {
  //           var address = interfaces[k][k2];
  //           if (address.family === 'IPv4' && !address.internal) {
  //               addresses.push(address.address);
  //           }
  //       }
  //   }
  //    request
  //       .post("http://192.168.10.54:9090/job/ADD_HOMEWORK/buildWithParameters")
  //       .send({
  //           git_url:definitionRepo,
  //           id:id,
  //           ip:addresses[0]
  //       })
  //       .type('application/json')
  //       .end((err,res)=>{
  //           if(err){
  //               console.log(err )
  //           }
  //           console.log('ok')
  //          res.sendStatus(200);
  //       });
  // const makerId = req.session.user.id;
  new HomeworkDefinition({
    description: '',
    // makerId,
    status: 0,
    isDeleted: false,
    uri: '',
    createTime,
    evaluateScript: '',
    templateRepository: '',
    result: '',
    name,
    definitionRepo,
    type
  }).save((err, homework) => {
    if (!err && homework) {
      res.status(201).send({homeworkId: homework._id});
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

module.exports = HomeworkDefinitionController;
