import async from 'async';
import Message from '../../models/messages';
import AgreementRequestAnswerHandler from './AgreementRequestAnswerHandler';
import DisagreementRequestAnswerHandler from './DisagreementRequestAnswerHandler';
import ToggleToReadHandler from './ToggleToReadHandler';
import DisagreementRequestInvitationHandler from './DisagreementRequestInvitationHandler';

export default class MessageService {
  constructor() {
    this.toggleToReadHandler = new ToggleToReadHandler();
    this.agreementRequestAnswerHandler = new AgreementRequestAnswerHandler();
    this.disagreementRequestAnswerHandler = new DisagreementRequestAnswerHandler();
    this.disagreementRequestInvitationHandler = new DisagreementRequestInvitationHandler();
  }

  operate({messageId, operation}, callback) {
    let msgObj;
    async.waterfall([
      (done) => {
        Message.findById(messageId, (err, doc) => {
          msgObj = Object.assign({}, doc.toJSON(), {operation});
          done(err, msgObj);
        });
      },
      (data, done) => {
        this.toggleToReadHandler.handle(msgObj, done);
      },
      (data, done) => {
        this.disagreementRequestAnswerHandler.handle(msgObj, done);
      },
      (data, done) => {
        this.agreementRequestAnswerHandler.handle(msgObj, done);
      },
      (data, done) => {
        this.disagreementRequestInvitationHandler.handle(msgObj, done);
      }
    ], callback);
  }
};
