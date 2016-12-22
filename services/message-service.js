import async from 'async';
import Message from '../models/messages';

export default class MessageService {
  operateMessage(data, callback) {
    async.waterfall([
      (done) => {
        Message.update({'_id': data.messageId}, {state: 1}, done);
      }
    ], callback);
  }
}
