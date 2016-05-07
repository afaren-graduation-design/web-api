require('should');
var async = require('async');

require('./spec-base');
var userSession = global.userSession;

describe("/homework/scroing", ()=> {
  it('GET /homework/scroing: should be return my scroing', function (done) {
    userSession
        .get("/homework/scroing")
        .expect(200)
        .expect((res)=> {
          res.body.length.should.equal(1);
          res.body[0].gitRepoUrl.should.equal('http://test.git');
        })
        .end(done)
  });

  it('POST /homework/scroing: should be return 200: ', function (done) {
      userSession
          .post("/homework/scroing")
          .send({
            gitRepoUrl: 'http://test2.git'
          })
          .expect(200)
          .end(done)
  });

  xit('PUT /homework/scroing: should be return 200: ', function (done) {
      userSession
          .put("/homework/scroing/572dcf6f041ccfa51fb3f9cb")
          .send({
            gitRepoUrl: 'http://test2.git'
          })
          .expect(200)
          .end(done)
  });

  it('POST /homework/scroing: should add a scroing', function (done) {

    function createScoring(done) {
      userSession
          .post("/homework/scroing")
          .send({
            gitRepoUrl: 'http://test2.git'
          })
          .end(done)
    }

    function getScoring(data, done) {
      userSession
          .get("/homework/scroing")
          .expect((res)=> {
            res.body.length.should.equal(2);
            res.body[1].gitRepoUrl.should.equal('http://test2.git');
            res.body[1].status.should.equal("3");
            res.body[1].message.should.equal("排队中,请稍候...");
          })
          .end(done)
    }

    async.waterfall([
      createScoring,
      getScoring
    ], done)
  });
});
