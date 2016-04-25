require('./spec-base');
var userSession = global.userSession;

describe("GET /homework/get-list", ()=> {
  it('should be return 200: GET /homework/get-list', function (done) {
    userSession
        .get("/homework/get-list")
        .expect(200)
        .expect(function (res) {
          res.body.homeworkQuizzes[0].id.should.equal(3);
          res.body.homeworkQuizzes[0].uri.should.equal('homework/quizzes');
        })
        .end(done)
  });
});