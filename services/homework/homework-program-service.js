var apiRequest = require('../api-request');
var async = require('async');

class HomeworkProgramService {
  getHomeworkListByMysql({homeworkName, stackId}, callback) {
    async.waterfall([
      (done) => {
        apiRequest.get('homeworkQuizzes', {homeworkName, stackId}, (err, resp) => {
          if (err) {
            done(err, null);
          }
          done(err, resp.body.homeworkQuizzes);
        });
      },
      (data, done) => {
        async.map(data, (homework, callback) => {
          apiRequest.get(homework.makerDetailUri, (err, resp) => {
            const makerName = resp.body.name;
            const homeworkList = Object.assign({}, homework, {makerName});
            callback(err, homeworkList);
          });
        }, done);
      },
      (homeworkList, done) => {
        done(null, {homeworkList});
      }
    ], callback);
  }
}

module.exports = HomeworkProgramService;
