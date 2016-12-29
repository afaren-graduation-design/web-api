import async from 'async';
import Message from '../../models/messages';

export default class ToggleToReadHandler {
  check(state) {
    return state === 0;
  }

  handle(msgObj, callback) {
    if (!this.check(msgObj.state)) {
      return callback();
    } else {
      async.waterfall([
        (done) => {
          Message.update({'_id': msgObj._id}, {state: 1}, done);
        }
      ], callback);
    }
  }
}
