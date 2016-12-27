import async from 'async';
import Message from '../../models/messages';

export default class ToggleToReadHandler {
  check({state}) {
    if (state === 0) {
      return true;
    } else {
      return false;
    }
  }

  handle({messageId, state}, callback) {
    async.waterfall([
      (done) => {
        Message.update({'_id': messageId}, {state: 1}, done);
      }
    ], callback);
  }
}
