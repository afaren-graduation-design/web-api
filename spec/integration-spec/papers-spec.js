require('./spec-base');
var userSession = global.userSession;

describe("GET /paper/1", ()=> {

  it('should be return sections: GET paper/1', function(done) {
    userSession
      .get("/papers/1")
      .expect(200)
      .end(done);
  })
});
