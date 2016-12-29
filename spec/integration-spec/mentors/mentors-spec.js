require('../spec-base');
require('should');
var userSession = global.userSession;

describe("GET /mentors", ()=> {
  iit('should be return 200: GET /mentors', function (done) {
    userSession
        .get("/mentors")
        .send({email: 'test@163.com'})
        .expect(200)
        .end(done)
  });
});