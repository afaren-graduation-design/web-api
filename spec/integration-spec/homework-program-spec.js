"use strict";

require('./spec-base');
var userSession = global.userSession;

describe("GET /homeworks/homeworkList", ()=> {
  it("should return mysql homeworkList", (done)=> {
    userSession
      .get('/homeworks')
      .expect(200)
      .expect((res) => {
        res.body.homeworkList.length.should.equal(8)
      })
      .end(done)
  })
});

describe("GET /homeworks/homeworkList/selection", ()=> {
  it("should return matched homeworkList by mysql", (done)=> {
    userSession
      .get('/homeworks/selection')
      .query({
        name: 'homework1'
      })
      .expect(200)
      .expect((res)=> {
        res.body.homeworkList.length.should.equal(1)
      })
      .end(done)
  })
})