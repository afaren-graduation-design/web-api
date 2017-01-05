import constant from '../../mixin/constant';
import HomeWorkScoring from '../../models/homework-scoring';
const deadline = 49;
export default class HomeWorkQuizSectionService {

  getStatus(section, callback) {
    let result = {sectionId: section._id, type: section.type};
    if (!section.startTime) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.NOTSTART}));
    }

    let currentTime = parseInt(new Date().getTime()) /
      (constant.time.SECONDS_PER_MINUTE *
      constant.time.MINUTE_PER_HOUR *
      constant.time.HOURS_PER_DAY *
      constant.time.MILLISECOND_PER_SECONDS);

    let startTime = parseInt(section.startTime) /
      (constant.time.SECONDS_PER_MINUTE *
      constant.time.MINUTE_PER_HOUR *
      constant.time.HOURS_PER_DAY *
      constant.time.MILLISECOND_PER_SECONDS);
    let isTimeout = currentTime - startTime > deadline;
    if (isTimeout) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.TIMEOUT}));
    }
    if (section.items.some(item => item.submits.length === 0)) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.INCOMPLETE}));
    }
    const items = section.items;
    const submitId = items[items.length - 1].submits[items[items.length - 1].submits.length - 1];

    new HomeWorkQuizSectionService().findHomeworkStatus(submitId, (err, status) => {
      return callback(null, Object.assign({}, result, {status}));
    });
  }

  findHomeworkStatus(_id, callback) {
    HomeWorkScoring.findById(_id).exec((err, doc) => {
      if (doc.status === 4) {
        callback(null, constant.sectionStatus.COMPLETE);
      } else {
        callback(null, constant.sectionStatus.INCOMPLETE);
      }
    });
  }
}
