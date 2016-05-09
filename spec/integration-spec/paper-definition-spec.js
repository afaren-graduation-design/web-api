require('./spec-base');
var userSession = global.userSession;

describe("GET /paper-definition", ()=> {
  it('should be return paper-definition list: GET /paper-definition', function (done) {
    userSession
        .get("/paper-definition")
        .expect(200)
        .expect(function(res){
          res.body[0].paperName.should.equal('java 基础测验');
          res.body[0].isPublished.should.equal(true);
          res.body[0].groupId.should.equal(1);
          res.body[0].groupHashId.should.equal('57231289d46aebaca22c08fe');
          res.body[0].makerId.should.equal(2);
          res.body[0].updateTime.should.equal(1462764146);
          res.body[0].createTime.should.equal(1462764060);
          res.body[0].homeworkSections.length.should.equal(1);
          res.body[0].logicPuzzleSections.length.should.equal(1);
        })
        .end(done);
  });
});