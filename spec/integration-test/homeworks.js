require('../spec-base.js');

describe("/paper", ()=> {
  it('should get sections list by paperId', (done)=>{
    global.testSession
      .get("/paper/1")
      .expect(200)
      .end(function(err, data) {
        if(err) {
          return done.fail(err);
        }

        done();
      });
  })
})
