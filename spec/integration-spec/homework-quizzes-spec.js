'use strict';

require('./spec-base');
var userSession = global.userSession;

describe('GET /homeworkQuizzes/1', ()=> {
  it("should return the homework name", (done)=> {
    userSession
        .get('/homeworkQuizzes/1')
        .expect(200)
        .expect((res)=> {
          console.log(res.body)
          res.body.homeworkName.should.equal('homework1')
        })
        .end(done)
  })
});