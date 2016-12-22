import MessageService from "../../services/message-service";

describe('MessageService',()=>{
  it.only('operateMessage',(done)=>{
    const msgObj = {messageId:1,userId:1,operation:'agreement'};
    const msgService = new MessageService();
    msgService.operateMessage(msgObj,done);

  });
});