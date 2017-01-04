const _timeBase = 90;
import constant from '../../mixin/constant';

export default class LogicPuzzleSectionService {
  getStatus(section, callback) {
    if (!section.startTime) {
      callback(null, {type: section.type, status: constant.sectionStatus.NOTSTART})
    }
    var TOTAL_TIME = _timeBase * constant.time.MINUTE_PER_HOUR;
    var startTime = section.startTime || Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
    var now = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
    var usedTime = now - startTime;
    if (section.endTime) {
      callback(null, {type: section.type, status: constant.sectionStatus.COMPLETE})
    }
    if (parseInt(TOTAL_TIME - usedTime) <= 0) {
      callback(null, {type: section.type, status: constant.sectionStatus.TIMEOUT});
    }

    callback(null, {type: section.type, status: constant.sectionStatus.INCOMPLETE})
  }
}