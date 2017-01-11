import apiRequest from '../api-request';
import async from 'async';

export default class HomeworkProgramService {
  getHomeworkListByMysql({homeworkName, type}, callback) {
    async.waterfall([
      (done) => {
        apiRequest.get('homeworkQuizzes', {homeworkName, type}, (err, resp) => {
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
