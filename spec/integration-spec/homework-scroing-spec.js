require('./spec-base');
var userSession = global.userSession;

describe("/homework/scroing", ()=> {
  it('should be return 200: POST /homework/scroing', function (done) {
    userSession
        .post("/homework/scroing")
        .expect(200)
        .end(done)
  });
});
