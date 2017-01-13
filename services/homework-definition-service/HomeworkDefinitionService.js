var async = require('async');
var config = require('config');
var request = require('superagent');

var apiRequest = require('../api-request');
var HomeworkDefinition = require('../../models/homework-definition');
var unique = require('../../tool/unique');
var addMakerName = require('../../tool/addMakerName');


class HomeworkDefinitionService {
  getHomeworkList({pageCount, page, order, sort}, callback) {
    let homeworks;
    let totalPage = 0;
    let sortData = {};
    sortData[sort] = order;
    let skipCount = pageCount * (page - 1);

    async.waterfall([
      (done) => {
        HomeworkDefinition.find({isDeleted: false}).sort(sortData).limit(Number(pageCount)).skip(skipCount).exec((err, data) => {
          done(err, data);
        });
      },
      (data, done) => {
        homeworks = data;
        let id;
        HomeworkDefinition.count({isDeleted: false}, (error, count) => {
          if (!error && count && data) {
            totalPage = Math.ceil(count / pageCount);
            let ids = data.map((homework) => {
              return homework.makerId;
            });
            id = unique(ids);
          }
          done(error, id, homeworks);
        });
      },
      (dataOne, dataSecond, done) => {
        apiRequest.get('users/' + dataOne + '/detail', (err, resp) => {
          if (!err && resp) {
            homeworks = addMakerName(resp, dataSecond);
          }
          done(err, homeworks);
        });
      },
      (data, done) => {
        apiRequest.get('stacks', (err, resp) => {
          var homeworks = data.map((homework) => {
            const item = resp.body.items.find(item => homework.stackId === item.stackId);
            const stack = {
              stackId: item.stackId,
              title: item.title
            };
            return Object.assign({}, homework, {stack});
          });
          done(err, {data: homeworks, totalPage});
        });
      }
    ], (err, data) => {
      callback(err, data);
    });
  }

  create(data, callback) {
    const {definitionRepo} = data;

    async.waterfall([
      (done) => {
        HomeworkDefinition.create(data, done);
      }, (data, done) => {
        const id = data._id;
        const callbackUrl = `${config.get('task.hookUrl')}/homeworkDefinitions/${id}/status`;

        request
            .post(config.get('task.addHomework'))
            .auth(config.get('task.user'), config.get('task.password'))
            .type('form')
            .send({definitionRepo, callbackUrl})
            .end((err) => {
              if (err) return done(err, null);
              done(null, {id});
            });
      }], callback);
  }
}

module.exports = HomeworkDefinitionService;