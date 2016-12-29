import async from 'async';
import Message from '../../models/messages';

export default class AgreementRequestAnswerHandler {
  check(msgObj) {
    return (msgObj.operation === 'agreement' && msgObj.type === 'requestAnswer');
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
