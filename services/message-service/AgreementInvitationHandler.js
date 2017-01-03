import async from 'async';
import Message from '../../models/messages';
import OperateHandler from './OperateHandler';
import apiRequest from '../../services/api-request';

export default class AgreementInvitationHandler extends OperateHandler {
  check(msgObj) {
    return (msgObj.operation === 'agreement' && msgObj.type === 'invitation')
  }

  subHandle(msgObj, callback) {
    async.waterfall([
      (done)=>{
        apiRequest.post(`relationshipCreating/${msgObj.to}/students/${msgObj.from}`,(err,doc)=>{

        })
      }
    ])
  }
}