import Message from '../../models/messages';
import OperateHandler from './OperateHandler';

export default class ToggleToReadHandler extends OperateHandler {
  check(state) {
    return state === 0;
  }

  realHandle(msgObj, callback) {
    Message.update({'_id': msgObj._id}, {state: 1}, callback);
  }
}
