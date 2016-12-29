import Message from '../../models/messages';
import OperateHandler from './OperateHandler';

export default class ToggleToReadHandler extends OperateHandler {
  check({state}) {
    console.log(state)
    console.log(state === 0)
    return state === 0;
  }

  subHandle(msgObj, callback) {
    Message.update({'_id': msgObj._id}, {state: 1}, callback);
  }
}
