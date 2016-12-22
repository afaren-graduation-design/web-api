import MessageService from "../../services/message-service";
var  Message = require('../../models/messages');
import 'should';

describe('MessageService', ()=> {
  it.only('operateMessage', function(done) {
    const msgObj = {
      messageId: '585b91c6651114311e917614',
      userId: 1,
      operation: 'agreement'
    };
    const msgService = new MessageService();
    msgService.operateMessage(msgObj, (err,data)=>{
      console.log("+++"+err);
      Message.findById('585baa8b1045c33c817471af',(err,doc)=>{
        console.log('jjj')
        const {state} = doc.toJson();
        state.should.equal(1);
        done();
      })

    });

  });
});