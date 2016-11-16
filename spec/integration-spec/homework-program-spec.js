require('./spec-base');
var userSession = global.userSession;

describe("GET homeworks",()=>{
    it('should be return homeworks list',(done)=>{
        userSession
            .get('/homeworks')
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
  it.only('should return success or fail of the updateHomework', (done)=> {
    userSession
      .put('/homework-program/homeworks/582bd78779ee8224014dba21')
      .send({
        type: "new modify",
        name: "update homework",
        definitionRepo: "baidu.com"
      })
      .expect(204)
      .end(done)
  })
});