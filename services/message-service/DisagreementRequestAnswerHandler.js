import async from 'async';
import Message from '../../models/messages';
import OperateHandler from './OperateHandler';

export default class DisAgreementRequestAnswerHandler extends OperateHandler {
  check(msgObj) {
    return (msgObj.operation === 'disagreement' && msgObj.type === 'requestAnswer');
  }

  subHandle(msgObj, callback) {
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
