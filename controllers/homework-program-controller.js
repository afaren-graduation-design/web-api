'use strict';

var HomeworkDefinition = require('../models/homework-definition');
var apiRequest = require('../services/api-request');
var unique = require('../tool/unique');
var addMakerName = require('../tool/addMakerName');
// var request = require('superagent');
// var yamlConfig = require('node-yaml-config');

// var taskApi = yamlConfig.load(__dirname + '/../config/config.yml').taskApi;

function HomeworkProgramController() {
};

HomeworkProgramController.prototype.getHomeworkList = (req, res) => {
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

HomeworkProgramController.prototype.getHomeworkListByMysql = (req, res) => {
  let pageCount = Number(req.query.pageCount) || 10;
  let page = req.query.page || 1;
  let skipCount = pageCount * (page - 1);
  apiRequest.get('homeworkQuizzes', (err, resp) => {
    if (!err && resp) {
      let totalPage = Math.ceil(resp.body.length/pageCount);
      console.log("========" + totalPage);
      let homeworkList = resp.body.slice(skipCount, skipCount + pageCount);
      console.log(homeworkList.length);
      if(page == totalPage){
        return res.status(202).send({homeworkList, totalPage});
      }
      return res.status(200).send({homeworkList, totalPage});
    }
    return res.sendStatus(404);
  });
};

HomeworkProgramController.prototype.matchHomework = (req, res) => {
  let pageCount = req.query.pageCount;
  let page = req.query.page;
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

HomeworkProgramController.prototype.updateHomework = (req, res) => {
  const {name, type, definitionRepo} = req.body;
  const homeworkId = req.params.homeworkId;
  HomeworkDefinition.update({_id: homeworkId}, {$set: {name, type, definitionRepo}}, (err) => {
    if (!err) {
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  });
};

HomeworkProgramController.prototype.getOneHomework = (req, res) => {
  const homeworkId = req.params.homeworkId;
  HomeworkDefinition.findOne({_id: homeworkId}, (err, homework) => {
    if (!err && homework) {
      res.send(homework);
    } else {
      res.sendStatus(400);
    }
  });
};

HomeworkProgramController.prototype.deleteHomework = (req, res) => {
  const homeworkId = req.params.homeworkId;
  HomeworkDefinition.update({_id: homeworkId}, {$set: {isDeleted: true}}, (err) => {
    if (!err) {
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  });
};

HomeworkProgramController.prototype.insertHomework = (req, res) => {
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

HomeworkProgramController.prototype.deleteBatch = (req, res) => {
  let homeworkIds = req.body.homeworkIds;

  let status = homeworkIds.map((homeworkId) => {
    HomeworkDefinition.update({_id: homeworkId}, {$set: {isDeleted: true}}, (err) => {
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

HomeworkProgramController.prototype.insertEvaluateScript = (req, res) => {
  res.send(req.file);
};

HomeworkProgramController.prototype.deleteSomeHomeworks = (req, res) => {
  var idArray = req.body.idArray;
  HomeworkDefinition.update({_id: {$in: idArray}}, {isDeleted: true}, {multi: true}).exec((err, data) => {
    if (!err && data) {
      res.status(204).end();
    } else {
      res.status(400).end();
    }
  });
};

module.exports = HomeworkProgramController;
