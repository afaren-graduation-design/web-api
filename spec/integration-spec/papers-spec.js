require('../spec-base.js');
var testSession = global.testSession;

describe("/paper", ()=> {
  it('should be a valid api: GET paper/1', function(done) {
    testSession
      .get("/papers/1")
      .expect(200)
      .end(done);
  })

  it('should be return sections: GET paper/1', function(done) {
    testSession
      .get("/papers/1")
      .expect(200)
      .expect(function(res) {
        expect(res.body.sections.length).toBe(2);
      })
      .end(function(err, data) {
        if(err) {
          done.fail(err);
        } else {
          done();
        }
      });
  })
})
