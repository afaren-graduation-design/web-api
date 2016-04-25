require('./spec-base');
var userSession = global.userSession;


describe("GET /dashboard", ()=> {
  it('should be return 200: GET /dashboard', function(done) {
    userSession
    .get("/dashboard")
    .expect(200)
    .end(done);
  });
});