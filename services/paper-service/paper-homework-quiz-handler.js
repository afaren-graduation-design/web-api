var {QuizItem} = require('../../models/quizItem');
var async = require('async');
var request = require('superagent');
var constant = require('../../mixin/constant');
var HomeWorkScoring = require('../../models/homework-scoring');
const deadline = 49;

class PaperHomeworkQuizHandler {
  bulkFindOrCreate(section, callback) {
    async.waterfall([
      (done) => {
        async.map(section.quizzes, (quiz, cb) => {
          request.get(`http://localhost:8080/paper-api/${quiz.definition_uri}`, (err, resp) => {
            if (err) {
              cb(err, null);
            }
            let {homeworkName, evaluateScript, templateRepository, createTime, description, id, type, uri, answerPath} = resp.body;
            QuizItem.findOrCreateHomework({id: id}, {
              homeworkName,
              evaluateScript,
              templateRepository,
              createTime,
              description,
              id,
              type,
              uri,
              answerPath
            }, (err, doc) => {
              cb(err, {quizId: doc.toJSON()._id});
            });
          });
        }, done);
      }
    ], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

  getStatus(section, callback) {
    let result = {type: 'HomeworkQuiz', sectionId: section._id, firstQuizId: section.quizzes[0]._id};
    if (!section.startTime) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.NOTSTART}));
    }

    let currentTime = convertMillsecondToDay(parseInt(new Date().getTime()));
    let startTime = convertMillsecondToDay(parseInt(section.startTime));
    let isTimeout = currentTime - startTime > deadline;

    if (isTimeout) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.TIMEOUT}));
    }
    if (section.quizzes.some(item => item.submits.length === 0)) {
      return callback(null, Object.assign({}, result, {status: constant.sectionStatus.INCOMPLETE}));
    }

    const items = section.quizzes;
    const submitId = items[items.length - 1].submits[items[items.length - 1].submits.length - 1];

    findHomeworkStatus(submitId, (err, status) => {
      if (err) {
        callback(null, null);
      }
      return callback(null, Object.assign({}, result, {status}));
    });
  }
}

function convertMillsecondToDay(millsecond) {
  return millsecond /
      (constant.time.SECONDS_PER_MINUTE *
      constant.time.MINUTE_PER_HOUR *
      constant.time.HOURS_PER_DAY *
      constant.time.MILLISECOND_PER_SECONDS);
}

function findHomeworkStatus(_id, callback) {
  HomeWorkScoring.findById(_id).exec((err, doc) => {
    if (err) {
      callback(null, null);
    }
    if (doc.status === 4) {
      callback(null, constant.sectionStatus.COMPLETE);
    } else {
      callback(null, constant.sectionStatus.INCOMPLETE);
    }
  });
}

module.exports = PaperHomeworkQuizHandler;