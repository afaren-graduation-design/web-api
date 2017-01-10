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
        Message.findById(msgObj._id, done);
      },
      (data, done) => {
        const from = data.from;
        const to = data.to;
        apiRequest.post(`relationshipCreating/${to}/students/${from}`, {}, (err, resp) => {
          if (err) {
            return done(err, null);
          }

        });
        let newMessage = {
          from: data.to,
          to: data.from,
          deeplink: data.deeplink,
          type: 'AGREE_INVITATION',
          state: 0
        };
        done(null, newMessage);
      },
      (data, done) => {
        new Message(data).save(done);
      }
    ], (err, data) => {
      callback(err, data);
    });
  }
}
