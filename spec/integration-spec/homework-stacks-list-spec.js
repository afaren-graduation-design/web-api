require('./spec-base');
var userSession = global.userSession;
require('should');

describe("GET /stacks", ()=> {
  it('should be return 200: GET /stacks', function (done) {
    userSession
      .get("/stacks")
      .expect(200)
      .expect(function (res) {
        res.body.items[0].should.equal({ "stackId": 1, "title": "JS"});
      })
      .end(done)
  });
});
