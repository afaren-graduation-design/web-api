import async from 'async';
import Message from '../../models/messages';
import OperateHandler from './OperateHandler';

export default class DisagreementInvitationHandler extends OperateHandler {
  check(msgObj) {
    return (msgObj.operation === 'disagreement' && msgObj.type === 'INVITATION');
  }

  subHandle(msgObj, callback) {
    async.waterfall([
      (done) => {
        Message.update({'_id': msgObj._id}, {state: 1}, done);
      },
      (data, done) => {
        let newData = {
          from: msgObj.to,
          to: msgObj.from,
          type: 'DISAGREE_INVITATION',
          state: 0
        };
        new Message(newData).save(done);
      }
    ], (err, data) => {
      callback(err, data);
    });
  }
}
