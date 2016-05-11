require('../spec-base');
userSession = global.userSession;

describe('/user/feedback', ()=> {

  it('Get /user-initialization/initializeQuizzes should return homework detail', (done)=> {
    userSession
        .get('/user-initialization/initializeQuizzes')
        .expect(200)
        .expect((res)=> {
          console.log(res.body);
        })
        .end(done)
  });
});