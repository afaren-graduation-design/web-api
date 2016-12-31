require('./spec-base');
var userSession = global.userSession;

describe('GET programs/:programId/papers', ()=> {
  it('should be return a paper: GET  programs/:programId/papers', (done)=> {
    userSession
      .get('/programs/1/papers')
      .expect(200)
      .expect(function (res) {
        res.body.data.length.should.equal(1);
      })
      .end(done);
  })
});

describe('POST programs/:programId/papers/:paperId', ()=> {
  it('should be save a paper in mongodb: post  programs/:programId/papers', (done)=> {
    userSession
      .get('/programs/1/papers/1')
      .expect(200)
      .end(done);
  })
});