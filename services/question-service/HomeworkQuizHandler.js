import OperateHandler from './OperateHandler';

export default class HomeworkQuizHandler extends OperateHandler {
  check(quiz) {
    return (quiz.__t === 'HomeworkQuiz');
  }

  subHandle(quiz, callback) {
    const homeworkQuiz = {
      uri: quiz.uri,
      id: quiz.id,
      desc: quiz.description,
      templateRepo: quiz.templateRepository
    };
    callback(null, homeworkQuiz);
  }
}
