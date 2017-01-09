import apiRequest from '../api-request';
import async from 'async';

export default class HomeworkProgramService {
  getHomeworkListByMysql({pageCount, skipCount}, callback) {
    let totalPage;
    let homeworkList = [];
    let arr = [];
    async.waterfall([
      (done) => {
        apiRequest.get('homeworkQuizzes', (err, resp) => {
          if (!err && resp) {
            totalPage = Math.ceil(resp.body.homeworkQuizzes.length / pageCount);
            homeworkList = resp.body.homeworkQuizzes.slice(skipCount, skipCount + pageCount);
          }
          done(err, homeworkList);
        });
      },
      (data, done) => {
        async.map(data, (homework, callback) => {
          apiRequest.get(homework.makerDetailUri, (err, resp) => {
            const makerName = resp.body.name;
            const homeworkList = Object.assign({}, homework, {makerName});
            callback(null, homeworkList);
          });
        }, done);
      },
      (homeworkList, done) => {
        done(null, {homeworkList, totalPage});
      }
    ], (err, data) => {
      callback(err, data);
    });
  }
}
