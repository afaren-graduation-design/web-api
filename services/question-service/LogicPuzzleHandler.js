import yamlConfig from 'node-yaml-config';
const config = yamlConfig.load('./config/config.yml');
import OperateHandler from './OperateHandler';

export default class LogicPuzzleHandler extends OperateHandler {
  check(quizInfo) {
    return (quizInfo.quiz.__t === 'LogicPuzzle');
  }

  subHandle(quizInfo, callback) {
    const logicPuzzle = {
      item: {
        id: quizInfo.quiz.id,
        initializedBox: JSON.parse(quizInfo.quiz.initializedBox),
        question: quizInfo.quiz.question,
        description: JSON.parse(quizInfo.quiz.description),
        chartPath: config.staticFileServer + quizInfo.quiz.chartPath
      },
      info: quizInfo.info
    };
    return callback(null, logicPuzzle);
  }
}
