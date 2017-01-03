require('./spec-base');
var userSession = global.userSession
require('should');

describe("GET /stacks", ()=> {
  it('should be return 200: GET /stacks', function (done) {
    userSession
      .get("/stacks")
      .expect(200)
      .expect(function (res) {
        res.body.items[0].should.equal({stacks:1,title:'JS'});
        res.body.items[1].should.equal({stacks:2,title:'JS'});
        res.body.items[2].should.equal({stacks:3,title:'JS'});
      })
      .end(done)
  });
});
