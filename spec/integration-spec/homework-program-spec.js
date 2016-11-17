"use strict";

require('./spec-base');
var userSession = global.userSession;

describe("GET MATCHED homeworks", ()=> {
  it.only("should return matched homeworks list", (done)=> {
    userSession
      .get('/homeworks/search')
      .query({
        page: 1,
        pageCount: 3,
        name: "juanz"
      })
      .expect(200)
      .expect((res) => {
        res.body.length.should.equal(3);
      })
      .end(done)
  })
})

describe("GET homeworks", ()=> {
  it('should be return homeworks list', (done)=> {
    userSession
        .get('/homework-program')
        .query({
            page:1,
            pageCount:3
        })
        .expect(200)
        .expect((res)=>{
            res.body.length.should.equal(3);
        })
        .end(done)
  })
});



describe("PUT homeworks/:homeworkId", () => {
  it('should return success or fail of the updateHomework', (done)=> {
    userSession
      .put('/homeworks/582bd78779ee8224014dba21')
      .send({
        type: "new modify",
        name: "update homework",
        definitionRepo: "baidu.com"
      })
      .expect(204)
      .end(done)
  })
});

describe("GET homework/:homeworkId", ()=> {
  it("should return one homework",(done)=>{
        userSession
          .get('/homeworks/582bf51629010b2a2a9bb6d6')
          .expect(200)
          .end(done)
  })
});

describe("DELETE homework/:homeworkId", ()=> {
  it("should return success or fail of deleteHomework",(done)=>{
    userSession
      .delete('/homeworks/582bf7ee5482bf2b99a8c7cb')
      .expect(204)
      .end(done)
  })
});

describe("POST /homeworks", ()=> {
  it("should return the new homework id", (done)=> {
    userSession
      .post('/homeworks')
      .send({
        name: "new homework",
        type: "js homework",
        definitionRepo: "github address"
      })
      .expect(201)
      .end(done)
  })
});