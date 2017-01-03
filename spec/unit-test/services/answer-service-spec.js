import  'should';
import '../base';
import answerService from '../../../services/answer/answer-service';

describe('answerService',()=>{
  it("should get 204 if current homework  haven't answer",()=>{
    const uri = 'homeworks/10';
    const id = '58637586f75871171070105f';
    const userId = 3;
    new answerService().getAnswer({uri,id,userId},(err,data)=>{
      data.status.should.equal(204);
      done(err);
    });
  });

  it('should get 200 if mentor agreement request answer',()=>{
    const uri = 'homeworks/1';
    const id = '58637586f75871171070105f';
    const userId = 3;
    new answerService().getAnswer({uri,id,userId},(err,data)=>{
      data.status.should.equal(200);
      done(err);
    });
  });

  it('should get 403 if mentor agreement request answer',()=>{
    const uri = 'homeworks/1';
    const id = '58637586f75871171070105f';
    const userId = 11;
    new answerService().getAnswer({uri,id,userId},(err,data)=>{
      data.status.should.equal(403);
      done(err);
    });
  });
});