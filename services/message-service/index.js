import async from 'async';
import Message from '../../models/messages';
import AgreementRequestAnswerHandler from './AgreementRequestAnswerHandler';
import DisagreementRequestAnswerHandler from './DisagreementRequestAnswerHandler';
import ToggleToReadHandler from './ToggleToReadHandler';

export default class MessageService {
  constructor() {
    this.toggleToReadHandler = new ToggleToReadHandler();
    this.agreementRequestAnswerHandler = new AgreementRequestAnswerHandler();
    this.disagreementRequestAnswerHandler = new DisagreementRequestAnswerHandler();
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
      (msgObj, done) => {
        this.toggleToReadHandler.handle(msgObj, (err, doc) => {
          done(err, doc);
        });
      },
      (msgObj, done) => {
        this.agreementRequestAnswerHandler.handle(msgObj, (err, doc) => {
          done(err, doc);
        });
      },
      (msgObj, done) => {
        this.disagreementRequestAnswerHandler.handle(msgObj, done);
      }
    ], callback);
  }
};
