import async from 'async';
import Message from '../../models/messages';
import OperateHandler from './OperateHandler';

export default class ToggleToReadHandler extends OperateHandler {
  check(state) {
    return state === 0;
  }

  realHandle(msgObj, callback) {
    async.waterfall([
      (done) => {
        Message.update({'_id': msgObj._id}, {state: 1}, done);
      }
    ], callback);
  }
}
