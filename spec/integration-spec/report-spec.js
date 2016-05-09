require('./spec-base');
var userSession = global.userSession;

describe("/report", ()=> {
  it("GET /paper/:paperId/scoresheet", function(done) {
    userSession
        .get('/report/paper/1/scoresheet')
        .expect(200)
        .expect((res)=> {
          console.log(res.text);
        })
        .end(done)
  })
})
