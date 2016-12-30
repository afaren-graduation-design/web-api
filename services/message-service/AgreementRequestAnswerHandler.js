import async from 'async';
import Message from '../../models/messages';
import OperateHandler from './OperateHandler';

export default class AgreementRequestAnswerHandler extends OperateHandler {
  check(msgObj) {
    return (msgObj.operation === 'agreement' && msgObj.type === 'requestAnswer');
  }

  subHandle(msgObj, callback) {
    async.waterfall([
      (done) => {
        Message.update({'_id': msgObj._id}, {state: 1}, done);
      },
      (data, done) => {
        Message.findById(msgObj._id, done);
      },

      (data, done) => {
        let newMessage = {
          from: data.to,
          to: data.from,
          deeplink: data.deeplink,
          type: 'agreeRequestAnswer',
          state: 0
        };
        new Message(newMessage).save(done);
      }
    ], callback);
  }
}
