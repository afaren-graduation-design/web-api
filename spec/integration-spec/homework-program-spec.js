"use strict";

require('./spec-base');
var userSession = global.userSession;

describe("GET /homeworks/homeworkList", ()=> {
  it("should return mysql homeworkList", (done)=> {
    userSession
      .get('/homeworks')
      .query({
        page: 1,
        pageCount: 3
      })
      .expect(200)
      .expect((res) => {
        res.body.homeworkList.length.should.equal(3)
      })
      .end(done)
  })
});

describe("GET /homeworks/homeworkList/selection", ()=> {
  it("should return matched homeworkList by mysql", (done)=> {
    userSession
      .get('/homeworks/selection')
      .query({
        page: 1,
        pageCount: 3,
        name: 'homework1'
      })
      .expect(202)
      .expect((res)=> {
        res.body.homeworkList.length.should.equal(1)
      })
      .end(done)
  })
})