const async = require('async');
const config = require('config');
const request = require('superagent');
const constant = require('../../mixin/constant');
const apiRequest = require('../api-request');
const HomeworkDefinition = require('../../models/homework-definition');
const unique = require('../../tool/unique');
const addMakerName = require('../../tool/addMakerName');
const path = require('path');
const mv = require('mv');

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
    const {definitionRepo, name, stackId} = data;
    let result = {};
    async.waterfall([
        (done) => {
          HomeworkDefinition.create({definitionRepo, name, stackId}, (err, date) => {
            if (err) return callback(err);
            done(err, date);
          });
        },
        (data, done) => {
          result = data.toJSON();
          const callbackUrl = `${config.get('task.hookUrl')}/homeworkDefinitions/${result._id}/status`;
          request
            .post(config.get('task.addHomework'))
            .type('form')
            .send({git: definitionRepo, callback_url: callbackUrl})
            .end(done);
        }],
      (err) => {
        if (err) {
          HomeworkDefinition.findByIdAndUpdate(id, {$set: {status: constant.createHomeworkStatus.ERROR}, callback})
        }
        callback(null, result);
      });
  }

  save(condition, callback) {
    const {description, status, result, script, answer, id} = condition;
    const createTime = parseInt(new Date().getTime() /
      constant.time.MILLISECOND_PER_SECONDS);
    const evaluateScript = script ? `./${script[0].path}` : ''; //Fixme 学生拿回题目答案路径
    const answerFilename = answer ? answer[0].filename : '';
    const answerPath = `./homework-answer/${answerFilename}`;
    let homeworkQuiz = {
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
    };
    if (status === constant.createHomeworkStatus.SUCCESS) {
      async.waterfall([
        (done) => {
          mv(path.resolve(__dirname, `../../homework-script/${answerFilename}`), path.resolve(__dirname, `../../homework-answer/${answerFilename}`), (err) => {
            done(err);
          })
        },
        (done) => {
          HomeworkDefinition.findById(id, (err, doc) => {
            done(err, doc);
          })
        },
        (doc, done) => {
          apiRequest.post('homeworkQuizzes', {
            'description': description,
            'evaluateScript': evaluateScript,
            'templateRepository': doc.toJSON().definitionRepo.toString(),
            'makerId': 1,
            'answerPath': answerPath,
            'createTime': createTime,
            'homeworkName': doc.toJSON().name.toString()
          }, done)
        },
        (resp, done) => {
          homeworkQuiz.uri = resp.body.uri;
          HomeworkDefinition.findByIdAndUpdate(id, homeworkQuiz, done);
        }
      ], (err) => {
        return callback(err);
      })
    } else {
      HomeworkDefinition.findByIdAndUpdate(id, homeworkQuiz, (err) => {
        return callback(err)
      })
    }
  }

  update(condition, callback) {
    const {name, stackId, definitionRepo, homeworkId} = condition;
    const callbackUrl = `${config.get('task.hookUrl')}/homeworkDefinitions/${homeworkId}/status`;
    async.waterfall([
        (done) => {
          HomeworkDefinition.update({_id: homeworkId}, {
            $set: {
              name,
              stackId,
              definitionRepo,
              status: constant.createHomeworkStatus.PEDDING
            }
          }, done);
        },
        (data, done) => {
          request
            .post(config.get('task.addHomework'))
            .type('form')
            .send({git: definitionRepo, callback_url: callbackUrl})
            .end(done)
        }]
      , (err, result) => {
        if (err) {
          return HomeworkDefinition.update({_id: homeworkId}, {$set: {status: constant.createHomeworkStatus.ERROR}}, callback)
        }
        return callback(err, result)
      });

  }
}

module.exports = HomeworkDefinitionService;