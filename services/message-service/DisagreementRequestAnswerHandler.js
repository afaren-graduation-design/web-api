import async from 'async';
import Message from '../../models/messages';
import OperateHandler from './OperateHandler';

export default class DisagreementRequestAnswerHandler extends OperateHandler {
  check(msgObj) {
    return (msgObj.operation === 'disagreement' && msgObj.type === 'REQUEST_ANSWER');
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
        let newData = {
          deeplink: data.deeplink,
          from: data.to,
          to: data.from,
          type: 'DISAGREE_REQUEST_ANSWER',
          state: 0
        };
        new Message(newData).save(done);
      }
    ], (err, data) => {
      callback(err, data);
    });
  }
}
