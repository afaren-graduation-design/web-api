require('../spec-base');

describe('/user/feedback', ()=> {

  it('Get /user/feedback should return homework detail', (done)=> {
    userSession
        .get('/user/feedback-result')
        .expect(200)
        .expect((res)=> {


        })
        .end(done)
  });
});