import constant from '../../mixin/constant';

const deadline = 7;
import AbstractSection from './abstract-section';

export default class HomeworkQuizSection extends AbstractSection {
  getStatus() {
    const quizzes = this.data.toJSON().quizzes;
    let isFinished = quizzes.every((item) => {
      return item.status === 4;
    });
    if (isFinished) {
      return constant.sectionStatus.COMPLETE;
    }
    let currentQuiz = quizzes.filter((item) => {
      return item.status !== 1 && item.status !== 4;
    })[0];
    var currentTime = parseInt(new Date().getTime()) /
      (constant.time.SECONDS_PER_MINUTE *
      constant.time.MINUTE_PER_HOUR *
      constant.time.HOURS_PER_DAY *
      constant.time.MILLISECOND_PER_SECONDS);
    var startTime = parseInt(currentQuiz.startTime) /
      (constant.time.SECONDS_PER_MINUTE *
      constant.time.MINUTE_PER_HOUR *
      constant.time.HOURS_PER_DAY);
    let isTimeout = currentTime - startTime > deadline;
    if (isTimeout) {
      return constant.sectionStatus.TIMEOUT;
    }
    return constant.sectionStatus.INCOMPLETE;
  }
}

