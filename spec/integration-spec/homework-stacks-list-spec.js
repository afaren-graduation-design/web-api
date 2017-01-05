require('./spec-base');
var userSession = global.userSession;
require('should');

describe("GET /stacks", ()=> {
  it('should be return 200: GET /stacks', function (done) {
    userSession
      .get("/stacks")
      .expect(200)
      .expect(function (res) {
        console.log(res.body.items[0].stackId)
        res.body.items[0].stackId.should.equal(2);
        res.body.items[0].title.should.equal('C#');
      })
      .end(done)
  });
});
