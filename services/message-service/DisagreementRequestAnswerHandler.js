import async from 'async';
import Message from '../../models/messages';

export default class DisAgreementRequestAnswerHandler {
  check(msgObj) {
    if (msgObj.operation === 'disagreement' && msgObj.type === 'requestAnswer') {
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
        delete data._id;
        let newData = Object.assign({}, data, {
          deeplink: data.deeplink,
          from: data.to,
          to: data.from,
          type: 'disagreeRequestAnswer',
          state: 1
        });
        new Message(newData).save(done);
      }
    ], callback);
  }
}
