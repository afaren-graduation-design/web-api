const _timeBase = 90;
import constant from '../../mixin/constant';

export default class LogicPuzzleSectionService {

  getStatus(section, callback) {
    let result = {type: section.type, sectionId: section._id};
    if (!section.startTime) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.NOTSTART}));
    }
    let TOTAL_TIME = _timeBase * constant.time.MINUTE_PER_HOUR;
    let startTime = section.startTime || Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
    let now = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
    let usedTime = now - startTime;
    if (section.endTime) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.COMPLETE}));
    }
    if (parseInt(TOTAL_TIME - usedTime) <= 0) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.TIMEOUT}));
    }
    return callback(null, Object.assign({}, result, {status: constant.sectionStatus.INCOMPLETE}));
  }
}
