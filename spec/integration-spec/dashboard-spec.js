require('./spec-base');
var userSession = global.userSession;


describe("GET /dashboard", ()=> {
  it('should be return 200: GET /dashboard', function (done) {
    userSession
        .get("/dashboard")
        .expect(200)
        .expect(function (res) {
          res.body.isPaperCommited.should.equal(false);
          res.body.isOverTime.should.equal(false);
          res.body.isFinished.should.equal(false);
        })
        .end(done);
  });
});