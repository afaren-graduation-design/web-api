require('./spec-base');
var userSession = global.userSession;
var adminSession = global.adminSession;


describe("GET /admin/channel", ()=> {

  it('should be return 403: GET /admin/channel', function(done) {
    userSession
        .get("/admin/channel")
        .expect(403)
        .end(done);
  });

  it('should be return channels: GET /admin/channel', function(done) {
    adminSession
        .get("/admin/channel")
        .expect(200)
        .end(done);
  })
});
