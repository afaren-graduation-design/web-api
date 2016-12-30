import PaperHomeworkQuiz from '../../models/paper-homework-quiz';
import async from 'async';
import request from 'superagent';
export default class PaperHomeworkQuizHandler {
  bulkFindOrCreate(section, callback) {
    async.waterfall([
      (done) => {
        async.map(section.quizzes, (quiz, cb) => {
          request.get(`http://localhost:8080/paper-api/${quiz.definition_uri}`, (err, resp) => {
            if (err) {
              throw err;
            }
            let {homeworkName, evaluateScript, templateRepository, createTime, description, id, type, uri, homeworkItem} = resp.body;
            PaperHomeworkQuiz.findOrCreate({id: homeworkItem.id}, {
              homeworkName,
              evaluateScript,
              templateRepository,
              createTime,
              description,
              id,
              type,
              uri
            }, (err, doc) => {
              cb(err, {id: doc.toJSON()._id, submit: []});
            });
          });
        }, done);
      }
    ], (err, result) => {
      if (err) {
        throw err;
      } else {
        callback(null, {type: 'homeworkQuiz', items: result});
      }
    });
  }
}
