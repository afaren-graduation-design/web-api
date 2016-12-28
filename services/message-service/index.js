import async from 'async';
import AgreementRequestAnswerHandler from './AgreementRequestAnswerHandler';
import DisagreementRequestAnswerHandler from './DisagreementRequestAnswerHandler';
import ToggleToReadHandler from './ToggleToReadHandler';

function MessageService(msgObj, callback) {
  async.waterfall([
    (done) => {
      let toggleToReadHandler = new ToggleToReadHandler();
      toggleToReadHandler.handle(msgObj, done);
    },
    (data, done) => {
      let agreementRequestAnswerHandler = new AgreementRequestAnswerHandler();
      agreementRequestAnswerHandler.handle(msgObj, done);
    },
    (data, done) => {
      let disagreementRequestAnswerHandler = new DisagreementRequestAnswerHandler();
      disagreementRequestAnswerHandler.handle(msgObj, done);
    }
  ], callback);
}

export default MessageService;
