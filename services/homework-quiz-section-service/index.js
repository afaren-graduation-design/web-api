import async from 'async';
import homeWorkScoringSchema from '../../models/homework-scoring';

export default class HomeWorkQuizSectionService {
  getStatus(section, callback) {
    async.waterfall([
      (done) => {
        (new HomeWorkQuizSectionService().findHomeworkStatus(section.items[0].id, callback), done);
      }
    ], (err, result) => {
      if (err) {
        throw err;
      }
      else {
        callback(null, {type: section.type, status: result});
      }
    });
  }

  findHomeworkStatus(quizId, callback) {
    const status = homeWorkScoringSchema.findOne(quizId).status;
    callback(null, status);
  }
}