import async from 'async';
import Message from '../../models/messages';

export default class AgreementRequestAnswerHandler {
  check(msgObj) {
    if (msgObj.operation === 'agreement' && msgObj.type === 'requestAnswer') {
      return true;
    } else {
      return false;
    }
  }

  handle(msgId, callback) {
    async.waterfall([
      (done) => {
        Message.findById(msgId, done);
      },

      (data, done) => {
        let newMessage = {
          from: data.to,
          to: data.from,
          deeplink: data.deeplink,
          type: 'agreeRequestAnswer',
          state: 1
        };
        new Message(newMessage).save(done);
      }
    ], callback);
  }
}
