require('./spec-base');
var userSession = global.userSession;


describe("GET /dashboard", ()=> {
  it('should be return 200: GET /dashboard', function (done) {
    userSession
        .get("/dashboard")
        .expect(200)
        .expect(function (res) {
          res.body.isFinishedDetail.should.equal(true);
          res.body.logicPuzzleEnabled.should.equal(true);
          res.body.homeworkQuizzesEnabled.should.equal(false);
        })
        .end(done);
  });
});