import async from 'async';
import Message from '../../models/messages';
import AgreementRequestAnswerHandler from './AgreementRequestAnswerHandler';
import DisagreementRequestAnswerHandler from './DisagreementRequestAnswerHandler';
import ToggleToReadHandler from './ToggleToReadHandler';

const messageService = ({messageId, operation}, callback) => {
  let msgObj;
  async.waterfall([
    (done) => {
      Message.findById(messageId, (err, doc) => {
        msgObj = Object.assign({}, doc.toJSON(), {operation});
        done(err, msgObj);
      });
    },
    (msgObj, done) => {
      let toggleToReadHandler = new ToggleToReadHandler();
      toggleToReadHandler.handle(msgObj, (err, doc) => {
        done(err, doc);
      });
    },
    (obj, done) => {
      Message.findById(messageId, (err, doc) => {
        msgObj = Object.assign({}, doc.toJSON(), {operation});
        done(err, msgObj);
      });
    },
    (msgObj, done) => {
      let agreementRequestAnswerHandler = new AgreementRequestAnswerHandler();
      agreementRequestAnswerHandler.handle(msgObj, (err, doc) => {
        done(err, doc);
      });
    },
    (msgObj, done) => {
      let disagreementRequestAnswerHandler = new DisagreementRequestAnswerHandler();
      disagreementRequestAnswerHandler.handle(msgObj, done);
    }
  ], callback);
};
export default messageService;
