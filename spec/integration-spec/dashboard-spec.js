require('./spec-base');
var userSession = global.userSession;


describe("POST /dashboard/:programId/:paperId", ()=> {
  it('should be return 200: POST /dashboard/:programId/:paperId', function (done) {
    userSession
        .post("/dashboard/1/1")
        .expect(200)
        .expect(function (res) {
          res.body.isFinishedDetail.should.equal(true);
        })
        .end(done);
  });
});