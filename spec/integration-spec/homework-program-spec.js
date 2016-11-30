"use strict";

require('./spec-base');
var userSession = global.userSession;

describe("GET MATCHED homeworks", ()=> {
  it("should return matched homeworks list", (done)=> {
    userSession
      .get('/homeworks/search')
      .query({
        page: 1,
        pageCount: 1,
        name: "juanz1"
      })
      .expect(200)
      .expect((res) => {
        res.body.data.length.should.equal(1);
      })
      .end(done)
  })
});

describe("GET homeworks", ()=> {
  it('should be return homeworks list', (done)=> {
    userSession
      .get('/homeworks')
      .query({
        page: 1,
        pageCount: 5
      })
      .expect(200)
      .expect((res)=> {
        res.body.data.length.should.equal(5);
      })
      .end(done)
  })
});


describe("PUT homeworks/:homeworkId", () => {
  it('should return success or fail of the updateHomework', (done)=> {
    userSession
      .put('/homeworks/5829958a7007c23870a1d680')
      .send({
        type: "new modify",
        name: "update homework",
        definitionRepo: "baidu.com"
      })
      .expect(204)
      .end(done)
  })
});

describe("GET homeworks/:homeworkId", ()=> {
  it("should return one homework", (done)=> {
    userSession
      .get('/homeworks/5829958a7007c23870a1d680')
      .expect(200)
      .end(done)
  })
});

describe("DELETE homeworks/:homeworkId", ()=> {
  it("should return success or fail of deleteHomework", (done)=> {
    userSession
      .delete('/homeworks/5829958a7007c23870a1d680')
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

describe("Delete /homeworks/deletion", ()=> {
    it("should return the delete msg", (done)=> {
        userSession
            .delete('/homeworks/deletion')
            .send({
                idArray:["5829958a7007c23870a1d681","5829958a7007c23870a1d680"]
            })
            .expect(204)
            .end(done)
    })
});

describe("GET /homeworks/homeworkList", ()=> {
  it("should return mysql homeworkList", (done)=> {
    userSession
      .get('/homeworks/homeworkList')
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

describe("GET /homeworks/homeworkList/search", ()=> {
  it("should return matched homeworkList by mysql", (done)=> {
    userSession
      .get('/homeworks/homeworkList/search')
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