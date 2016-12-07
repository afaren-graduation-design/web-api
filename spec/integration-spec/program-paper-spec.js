require('./spec-base');
var userSession = global.userSession;

describe('GET programs/:programId/papers', ()=> {
  it('should be return a paper: GET  programs/:programId/papers', (done)=> {
    userSession
      .get('/programs/1/papers')
      .expect(200)
      .expect(function (res) {
        res.body.data.length.should.equal(17);
      })
      .end(done);
  })
});

describe('GET programs/:programId/papers/1', ()=> {
  it('should be return a paper: GET  programs/:programId/papers/1', (done)=> {
    userSession
      .get('/programs/1/papers/1')
      .expect(200)
      .expect((res) => {
        console.log(res.body)
        res.body.data.paperName.should.equal('java');
      })
      .end(done);
  })
});