require('./spec-base');
var userSession = global.userSession;
describe('GET program/:programId/paper/:paperId',()=>{
   it.only('should be return a paper: GET  program/:programId/paper/:paperId',(done)=>{
       userSession
           .get('/program/1/paper/1')
           .expect(200)
           .expect(function (res) {
               res.body.id.should.equal(1);
               res.body.programId.should.equal(1);
               res.body.sections[0].description.should.equal("这是描述");
               res.body.sections[0].SectionType.should.equal('blankQuizzes');
               res.body.sections[0].quizzes.length.should.equal(2);
           })
           .end(done);
   })
});