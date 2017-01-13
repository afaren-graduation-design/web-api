var apiRequest = require('../api-request');
var async = require('async');
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
    const {name, stackId, definitionRepo} = data;
    let error = {};

    async.waterfall([
      (done) => {
        new HomeworkDefinition({
          name,
          stackId,
          definitionRepo,
          status: 1
        }).save((err, data) => {
          done(err, data);
        });
      }, (data, done) => {
        const callbackUrl = `http://localhost/api/homeworkDefinitions/${data._id}/status`;
        request
            .post('http://localhost:8888/job/ADD-HOMEWORK/buildWithParameters')
            .auth('admin', 'admin')
            .type('form')
            .send({
              git: definitionRepo,
              callback_url: callbackUrl
            })
            .end((err) => {
              if (err) {
                return done(err, null);
              }
              done(null, {id: data._id});
            });
      }], callback);
  }
}

module.exports = HomeworkDefinitionService;