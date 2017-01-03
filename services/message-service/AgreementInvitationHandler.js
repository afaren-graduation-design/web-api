import async from 'async';
import Message from '../../models/messages';
import OperateHandler from './OperateHandler';
import apiRequest from '../api-request';

export default class AgreementInvitationHandler extends OperateHandler {
  check(msgObj) {
    return (msgObj.operation === 'agreement' && msgObj.type === 'INVITATION');
  };

  subHandle(msgObj, callback) {
    async.waterfall([
      (done) => {
        Message.update({'_id': msgObj._id}, {state: 1}, () => {
          done(null, null);
        });
      },
      (data, done) => {
        const from = msgObj.from;
        const to = msgObj.to;
        apiRequest.post(`relationshipCreating/${to}/users/${from}`, {}, (err, resp) => {
          if (err) {
            return done(err, null);
          }
          let newMessage = {
            from: msgObj.to,
            to: msgObj.from,
            deeplink: msgObj.deeplink,
            type: 'AGREE_INVITATION',
            state: 0
          };
          new Message(newMessage).save(done);
        });
      }
    ], (err, data) => {
      callback(err, data);
    });
  }
}
