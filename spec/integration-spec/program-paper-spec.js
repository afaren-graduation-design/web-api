require('./spec-base');
var userSession = global.userSession;
describe('GET program/:programId/paper/:paperId',()=>{
   it('should be return a paper: GET  program/:programId/paper/:paperId',(done)=>{
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

 describe('POST program/:id/papers', ()=>{
     it.only('should be return a paperId',(done)=>{
         userSession
             .post('/program/1/papers')
             .send({
                 programId:1,
                 isDistribution:false,
                 description:'这是一个描述',
                 title:'题目',
                 sections:[
                     {
                         title:'logicQuizzes',
                         quizzes:{
                             easy:1,
                             normal:1,
                             hard:1
                         }
                     },{
                        title:'homeworkQuizzes',
                         quizzes:[
                             {id:1,uri:'/homeworkQuizzes/1'},{id:2,uri:'/homeworkQuizzes/2'}
                         ]
                     }
                 ]
             })
             .expect(201)
             .end(done);
     })
});