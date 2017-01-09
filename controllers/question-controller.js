import {SectionItem} from '../models/sectionItem';
var yamlConfig = require('node-yaml-config');
var config = yamlConfig.load('./config/config.yml');

class QuestionController {
  getQuestion(req, res, next) {
    const questionId = req.params.questionId;
    SectionItem.findOne({_id: questionId})
      .exec((err, doc) => {
        if (err) {
          return next(err);
        }
        let userAnswer = doc.userAnswer || doc.answer || null;

        let data = {
          item: {
            id: doc.id,
            initializedBox: JSON.parse(doc.initializedBox),
            question: doc.question,
            description: JSON.parse(doc.description),
            chartPath: config.staticFileServer + doc.chartPath
          },
          userAnswer
        };
        res.send(data);
      });
  };
}

module.exports = QuestionController;
