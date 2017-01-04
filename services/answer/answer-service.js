import apiRequest from '../api-request';
import Message from '../../models/messages';
import userHomeworkQuizzes from '../../models/user-homework-quizzes';

export default class AnswerService {
  getAnswer({uri, id, userId}, callback) {
    var answer = {};
    var path = '';
    apiRequest.get(uri, (err, doc) => {
      if (!doc.body.homeworkItem.answerPath) {
        answer.status = 204;
        return callback(err, answer);
      } else {
        path = doc.body.homeworkItem.answerPath;
      }
      this.requestAnswerReplyMsgOperation({uri, id, userId}, (err, data) => {
        if (data === 200) {
          answer.status = data;
          answer.path = path;
        }
        callback(err, answer);
      });
    });
  }

  requestAnswerReplyMsgOperation({uri, id, userId}, callback) {
    var requestAnswerReply = {};
    var status;
    userHomeworkQuizzes.findOne({userId: userId, _id: id}, (err, doc) => {
      if (err) {
        return callback(err, null);
      }
      var homeworkId = uri.split('/')[1];
      requestAnswerReply.deeplink = `papers/${doc.paperId}/sections/1/homeworks/${homeworkId}`;
      requestAnswerReply.to = userId;
      Message.findOne(requestAnswerReply, (err, doc) => {
        status = doc.type === 'agreementRequestAnswer' ? 200 : 403;
        callback(err, status);
      });
    });
  }
}
