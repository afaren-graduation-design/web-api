const _timeBase = 90;
import constant from '../../mixin/constant';
import AbstractSection from '../paper-service/abstract-section';

export default class LogicPuzzleSection extends AbstractSection {
  getStatus() {
    var TOTAL_TIME = _timeBase * constant.time.MINUTE_PER_HOUR;

    var startTime = this.data.startTime || Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
    var now = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;

    var usedTime = now - startTime;
    if (this.data.isCommited) {
      return constant.sectionStatus.COMPLETE;
    }

    if (parseInt(TOTAL_TIME - usedTime) <= 0) {
      return constant.sectionStatus.TIMEOUT;
    }

    return constant.sectionStatus.INCOMPLETE;
  }
}

