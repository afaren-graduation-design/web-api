var yamlConfig = require('node-yaml-config');
const config = yamlConfig.load('./config/config.yml');
var OperateHandler = require('./OperateHandler');

class LogicPuzzleHandler extends OperateHandler {
  check(quizzes) {
    return (quizzes.quizId.__t === 'LogicPuzzle');
  }

  subHandle(quizzes, callback) {
    let userAnswer = quizzes.submits.length === 0 ? '' : quizzes.submits[quizzes.submits.length - 1].userAnswer;
    const logicPuzzle = {
      item: {
        id: quizzes.quizId.id,
        initializedBox: JSON.parse(quizzes.quizId.initializedBox),
        question: quizzes.quizId.question,
        description: JSON.parse(quizzes.quizId.description),
        chartPath: config.staticFileServer + quizzes.quizId.chartPath,
        answer: quizzes.quizId.answer
      },
      userAnswer: quizzes.quizId.answer || userAnswer,
      isExample: !!quizzes.quizId.answer,
      info: quizzes.info
    };
    callback(null, logicPuzzle);
  }
}

module.exports = LogicPuzzleHandler;
