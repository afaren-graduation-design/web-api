import async from 'async';
import Message from '../../models/messages';

export default class DisAgreementRequestAnswerHandler {
  check(msgObj) {
    return (msgObj.operation === 'disagreement' && msgObj.type === 'requestAnswer');
  }

  handle(msgObj, callback) {
    if (!this.check(msgObj)) {
      return callback();
    }
    async.waterfall([
      (done) => {
        Message.findById(msgObj._id, done);
      },

      (data, done) => {
        let newData = {
          deeplink: data.deeplink,
          from: data.to,
          to: data.from,
          type: 'disagreeRequestAnswer',
          state: 1
        };
        new Message(newData).save(done);
      }
    ], callback);
  }
}
