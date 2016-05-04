require('./spec-base');
var adminSession = global.adminSession;

describe("PUT /group/:groupHash", ()=> {
  it('should be return 201: PUT /group/:groupHash', function (done) {
    adminSession
        .put("/group/57287ba8c3397e53c404f3ae")
        .send({
          "name": "twars",
          "avatar": "",
          "isAnnouncePublished": true,
          "announcement": "fffffff"
        })
        .expect(200)
        .expect(function (res){
          res.body.status.should.equal(201)
        })
        .end(done)
  });

  it('should be return 200: PUT /group/:groupHash', function (done) {
    adminSession
        .put("/group/57287ba8c3397e53c404f3a9")
        .send({
          "name": "twars",
          "avatar": "",
          "isAnnouncePublished": true,
          "announcement": "fffffff"
        })
        .expect(200)
        .expect(function (res){
          res.body.status.should.equal(200)
        })
        .end(done)
  });
});