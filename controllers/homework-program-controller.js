"use strict";

var HomeworkDefinition = require('../models/homework-definition');
var apiRequest = require('../services/api-request');

function HomeworkProgramController() {

};

HomeworkProgramController.prototype.getHomeworkList = (req, res) => {
  let pageCount = req.query.pageCount;
  let page = req.query.page;
  let skipCount = pageCount * (page - 1);

  HomeworkDefinition.find({isDeleted: false}).limit(Number(pageCount)).skip(skipCount).exec((err, data)=> {
    HomeworkDefinition.count({isDeleted: false}, (error, count) => {
      if (!err && !error && count && data) {
        let totalPage = Math.ceil(count / pageCount);
        let ids = data.map((homework) => {
          return homework.makerId
        });
        apiRequest.get("users/" + ids + "/detail", (err, resp) => {
          if (!err && resp) {
            let homeworks = resp.body.map((id) => {
              let user = data.find((item) => {
                return item.makerId === id.userId;
              });
              user.name = id.name;
              return user;
            });
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
  })
};

HomeworkProgramController.prototype.matchHomework = (req, res) => {
  let pageCount = req.query.pageCount;
  let page = req.query.page;
  let skipCount = pageCount * (page - 1);
  let name = req.query.name;
  HomeworkDefinition.find({name, isDeleted: false}).limit(Number(pageCount))
    .skip(skipCount).exec((err, data) => {
    HomeworkDefinition.count({isDeleted: false}, (error, count) => {
      if (!err && !error && count && data) {
        let totalPage = Math.ceil(count / pageCount);
        let ids = data.map((homework) => {
          return homework.makerId
        });
        apiRequest.get("users/" + ids + "/detail", (err, resp) => {
          if (!err && resp) {
            let homeworks = resp.body.map((id) => {
              let user = data.find((item) => {
                return item.makerId === id.userId;
              });
              user.name = id.name;
              return user;
            });
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

  })
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
  })
};

HomeworkProgramController.prototype.getOneHomework = (req, res) => {
  const homeworkId = req.params.homeworkId;
  HomeworkDefinition.find({_id: homeworkId}, (err, homework)=> {
    if (!err && homework) {
      res.send({homework});
    } else {
      res.sendStatus(400);
    }
  })
};

HomeworkProgramController.prototype.deleteHomework = (req, res) => {
  const homeworkId = req.params.homeworkId;
  HomeworkDefinition.update({_id: homeworkId}, {$set: {isDeleted: true}}, (err) => {
    if (!err) {
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  })
};

HomeworkProgramController.prototype.insertHomework = (req, res) => {
  const {name, type, definitionRepo} = req.body;
  var createTime = new Date().toDateString();

  // const makerId = req.session.user.id;
  new HomeworkDefinition({
    description: "",
    // makerId,
    status: 0,
    isDeleted: false,
    uri: "",
    createTime,
    evaluateScript: "",
    templateRepository: "",
    result: "",
    name,
    definitionRepo,
    type
  }).save((err, homework) => {
    if (!err && homework) {
      res.status(201).send({homeworkId: homework._id});
    } else {
      res.sendStatus(400);
    }
  })
};
module.exports = HomeworkProgramController;
