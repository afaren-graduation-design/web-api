import 'should';
import MessageService from '../../../services/message-service';
import Message from '../../../models/messages';
import '../base';

describe('MessageService', ()=> {
  it.only('operateMessage should make the state to 1', function(done) {

    const msgObj = {
      messageId: '585bc4e613c65e2f61fede25',
      userId: 1,
      operation: 'agreement'
    };
    const msgService = new MessageService();
    msgService.operateMessage(msgObj, (err,data)=>{
      
      Message.findById('585bc4e613c65e2f61fede25',(err,doc)=>{
        const {state} = doc.toJSON();
        state.should.equal(1);
        done(err);
      })

    });

  });
});