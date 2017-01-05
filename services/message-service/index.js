import async from 'async';
import Message from '../../models/messages';
import AgreementRequestAnswerHandler from './AgreementRequestAnswerHandler';
import DisagreementRequestAnswerHandler from './DisagreementRequestAnswerHandler';
import ToggleToReadHandler from './ToggleToReadHandler';
import DisagreementInvitationHandler from './DisagreementInvitationHandler';
import AgreementInvitationHandler from './AgreementInvitationHandler';

export default class MessageService {
  constructor() {
    this.toggleToReadHandler = new ToggleToReadHandler();
    this.agreementRequestAnswerHandler = new AgreementRequestAnswerHandler();
    this.disagreementRequestAnswerHandler = new DisagreementRequestAnswerHandler();
    this.disagreementInvitationHandler = new DisagreementInvitationHandler();
    this.agreementInvitationHandler = new AgreementInvitationHandler();
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
        this.agreementInvitationHandler.handle(msgObj, done);
      },
      (data, done) => {
        this.disagreementInvitationHandler.handle(msgObj, done);
      }
    ], callback);
  }
};
