require('../spec-base');
require('should');
var userSession = global.userSession;

describe("POST /messages", ()=> {
  it('should be return 201: POST /messages', function (done) {
    userSession
      .post("/messages")
      .send({
        to: 1,
        deeplink: "papers/1/sections/1/homeworks/1",
        type: "requestAnswer"
      })
      .expect(201)
      .expect((res) => {
        res.body.uri.should.match(/^messages\/.{24}/)
      })
      .end(done)

  });
});

describe("POST /messages/:messageId/:operation", ()=> {
  it('should be return 200:POST /messages/:messageId/agreement', function (done) {
    userSession
      .post("/messages/585bc4e613c65e2f61fede25/agreement")
      .expect(200)
      .end(done);
  });
});

describe("GET /messages", ()=> {
  it('should be return 200: GET /messages', function (done) {
    userSession
        .get("/messages")
        .expect(200)
        .end(done)
  });
});

describe.only("GET /messages/unread", () => {
  it('should be return 200: GET /messages/unread',function (done) {
    userSession
        .get("/message/unread")
        .expect(200)
        .end(done)
  })
});