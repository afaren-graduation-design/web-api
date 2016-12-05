require('./spec-base');
var userSession = global.userSession;

describe('/user/:userId/programs', ()=> {
  it(' GET /user/:userId/programs should return programIds', (done)=> {
    userSession
        .get('/user/1/programs')
        .expect(200)
        .expect((res)=> {
            res.body.programIds.length.should.equal(4)
        })
        .end(done)
  });
});