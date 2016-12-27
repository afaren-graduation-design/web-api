import async from 'async';
import Message from '../models/messages';

export default class DisAgreementRequestAnswerHandler {
  check(msgObj) {
    if (msgObj.operation === 'disagreement' && msgObj.type === 'requestAnswer') {
      return true;
    } else {
      return false;
    }
  }

  handle(msgId, callback) {

  }
}
