import async from 'async';
import constant from '../../mixin/constant'
import HomeWorkScoring from '../../models/homework-scoring';

export default class HomeWorkQuizSectionService {
  getStatus(section, callback) {
    let status;
    async.waterfall([
      (done) => {
        if (!section.startTime) {
          status = constant.sectionStatus.NOTSTART;
        }
        done(status);
      },
      (done) => {
        var currentTime = parseInt(new Date().getTime()) /
            (constant.time.SECONDS_PER_MINUTE *
            constant.time.MINUTE_PER_HOUR *
            constant.time.HOURS_PER_DAY *
            constant.time.MILLISECOND_PER_SECONDS);
        var startTime = parseInt(section.startTime) /
            (constant.time.SECONDS_PER_MINUTE *
            constant.time.MINUTE_PER_HOUR *
            constant.time.HOURS_PER_DAY);
        let isTimeout = currentTime - startTime > deadline;
        if (isTimeout) {
          status = constant.sectionStatus.TIMEOUT;
        }
        done(status);
      },
      (done) => {
        if (section.items.some(item => item.submits.length === 0)) {
          status = constant.sectionStatus.INCOMPLETE;
        }
        done(status);
      },
      (done) => {
        const submitId = section.items[-1].submits[-1];
        new HomeWorkQuizSectionService().findHomeworkStatus(submitId, done);
      }
    ], (err, result) => {
      if (err && typeof err === number) {
        callback(null,{type: section.type, status: err})
      }
    });
  }

  findHomeworkStatus(_id, callback) {
    HomeWorkScoring.findOne(_id).exec((err, doc)=> {
      if (doc.status === 4) {
        callback(constant.sectionStatus.COMPLETE);
      } else {
        callback(constant.sectionStatus.INCOMPLETE);
      }
    });
  }
}