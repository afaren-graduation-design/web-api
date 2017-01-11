import OperateHandler from './OperateHandler';

export default class HomeworkQuizHandler extends OperateHandler {
  check(quizInfo) {
    if (!quizInfo.quiz) {
      return false;
    }
    return (quizInfo.quiz.__t === 'HomeworkQuiz');
  }

  subHandle(quizInfo, callback) {
    const homeworkQuiz = {
      uri: quizInfo.quiz.uri,
      id: quizInfo.quiz.id,
      desc: quizInfo.quiz.description,
      templateRepo: quizInfo.quiz.templateRepository,
      info: quizInfo.info
    };
    return callback(null, homeworkQuiz);
  }
}
