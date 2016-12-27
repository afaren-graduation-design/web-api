import 'should';
import MessageService from '../../../services/message-service';
import DisagreementRequestAnswerHandler from '../../../services/message-service/DisagreementRequestAnswerHandler';
import ToggleToReadHandler from  '../../../services/message-service/ToggleToReadHandler';
import Message from '../../../models/messages';
import '../base';

describe('MessageService', () => {
  it('operateMessage should make the state to 1', function (done) {

    const msgObj = {
      messageId: '585bc4e613c65e2f61fede25',
      userId: 1,
      operation: 'agreement'
    };
    const msgService = new MessageService();
    msgService.operateMessage(msgObj, (err, data) => {

      Message.findById('585bc4e613c65e2f61fede25', (err, doc) => {
        const {state} = doc.toJSON();
        state.should.equal(1);
        done(err);
      })

    });

  });
});

describe.only('IgnoreRequestAnswerHanlerService', () => {
  it('check whether state is 0', () => {
    const msgObj = {
      messageId: '585bc4e613c65e2f61fede25',
      state: 0
    };

    const ToggleToRead = new ToggleToReadHandler();
    const result = ToggleToRead.check(msgObj);
    result.should.equal(true);
  });

  it('check whether state is not 0', () => {
    const msgObj = {
      messageId: '585bc4e613c65e2f61fede25',
      state: 1
    };

    const ToggleToRead = new ToggleToReadHandler();
    const result = ToggleToRead.check(msgObj);
    result.should.equal(false);
  });

  it('change state from 0 to 1', () => {
    const msgObj = {
      messageId: '585bc4e613c65e2f61fede25',
      state: 0
    };

    const ToggleToRead = new ToggleToReadHandler();
    ToggleToRead.handle(msgObj, (err, data) => {
      Message.findById('585bc4e613c65e2f61fede25', (err, doc) => {
        const {state} = doc.toJson();
        state.should.equal(1);
        done(err);
      });
    });
describe('DisagreementRequestAnswerHandler', ()=> {
  it.only('should return false when input operation is not disagreement', () => {
    const msgObj = {
      type: 'requestAnswer',
      operation: 'agreement'
    };

    const disagreementRequestAnswerHandler = new DisagreementRequestAnswerHandler();
    const result = disagreementRequestAnswerHandler.check(msgObj);
    result.should.equal(false);
  });

  it.only('should return true when input operation is disagreement', () => {
    const msgObj = {
      type: 'requestAnswer',
      operation: 'disagreement'
    };

    const disagreementRequestAnswerHandler = new DisagreementRequestAnswerHandler();
    const result = disagreementRequestAnswerHandler.check(msgObj);
    result.should.equal(true);
  });
});