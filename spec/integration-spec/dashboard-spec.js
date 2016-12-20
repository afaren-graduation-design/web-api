require('./spec-base');
var userSession = global.userSession;


describe("GET /dashboard/:programId/:paperId", ()=> {
  it('should be return 200: GET /dashboard/:programId/:paperId', function (done) {
    userSession
        .get("/dashboard/1/1")
        .expect(200)
        .expect(function (res) {
          res.body.isFinishedDetail.should.equal(true);
          res.body.logicPuzzleEnabled.should.equal(true);
          res.body.homeworkQuizzesEnabled.should.equal(false);
        })
        .end(done);
  });
});