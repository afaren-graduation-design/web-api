require('./spec-base');
var testSession = global.testSession;

describe("GET /paper/1", ()=> {

  it('should be return sections: GET paper/1', function(done) {
    testSession
      .get("/papers/1")
      .expect(200)
      .end(done);
  })
});
