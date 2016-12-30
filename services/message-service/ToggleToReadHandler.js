import async from 'async';
import Message from '../../models/messages';
import OperateHandler from './OperateHandler';

export default class ToggleToReadHandler extends OperateHandler {
  check(msgObj) {
    return (msgObj.operation === 'read' || msgObj.state === 0);
  }

  subHandle(msgObj, callback) {
    async.waterfall([
      (done) => {
        Message.update({'_id': msgObj._id}, {state: 1}, (data) => {
          done(null, msgObj);
        });
      },
      (msgObj, done) => {
        Message.findById(msgObj._id, done);
      }
    ], callback);
  }
}
