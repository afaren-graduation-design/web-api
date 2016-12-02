require('./spec-base');
var userSession = global.userSession;

describe('POST program/:id/papers', ()=> {
  it('should be return a paperId', (done)=> {
    userSession
      .post('/program/1/papers')
      .send({
        programId: 1,
        isDistribution: false,
        description: '这是一个描述',
        title: '题目',
        sections: [
          {
            title: 'logicQuizzes',
            quizzes: {
              easy: 1,
              normal: 1,
              hard: 1
            }
          }, {
            title: 'homeworkQuizzes',
            quizzes: [
              {id: 1, uri: '/homeworkQuizzes/1'}, {id: 2, uri: '/homeworkQuizzes/2'}
            ]
          }
        ]
      })
      .expect(201)
      .end(done);
  })
});

describe('GET program/:programId/papers/:paperId', ()=> {
  it('should be return a paper: GET  program/:programId/papers/:paperId', (done)=> {
    userSession
      .get('/program/1/papers/5829958a7007c23870a1d68a')
      .expect(200)
      .expect(function (res) {
        res.body[0].programId.should.equal(1);
        res.body[0].sections[0].title.should.equal("逻辑题");
        res.body[0].sections[1].title.should.equal("编程题");
      })
      .end(done);
  })
});

describe('PUT program/:id/papers/:id', ()=> {
  it('should be return a paperId', (done)=> {
    userSession
      .put('/program/1/papers/5829958a7007c23870a1d68a')
      .send({
        title: "new title",
        description: "update paper-api",
        sections: [
          {
            title: "logicQuizzes",
            quizzes: {
              easy: 1,
              normal: 1,
              hard: 1
            }
          }, {
            title: "homeworkQuizzes",
            quizzes: [{id: 1, uri: '/homeworkQuizzes/1'}, {id: 2, uri: '/homeworkQuizzes/2'}]
          }
        ]
      })
      .expect(204)
      .end(done);
  })
});

describe('POST program/:id/papers', ()=> {
  it('should be return a paperId', (done)=> {
    userSession
      .post('/program/1/papers')
      .send({
        programId: 1,
        isDistribution: false,
        description: '这是一个描述',
        title: '题目',
        sections: [
          {
            title: 'logicQuizzes',
            quizzes: {
              easy: 1,
              normal: 1,
              hard: 1
            }
          }, {
            title: 'homeworkQuizzes',
            quizzes: [
              {id: 1, uri: '/homeworkQuizzes/1'}, {id: 2, uri: '/homeworkQuizzes/2'}
            ]
          }
        ]
      })
      .expect(201)
      .end(done);
  })
});

describe("GET program/:programId/papers", ()=> {
  it('should be return paper list', (done)=> {
    userSession
      .get('/program/1/papers')
      .query({
        page: 1,
        pageCount: 10
      })
      .expect(200)
      .expect((res)=> {
        res.body.data.length.should.equal(10);
      })
      .end(done)
  })
});
describe('DELETE program/:id/papers/:id', ()=> {
  it('should be return a httpCode', (done)=> {
    userSession
      .delete('/program/1/papers/5829958a7007c23870a1d68a')
      .expect(204)
      .end(done);
  })
});

describe("GET program/:programId/papers/selection", ()=> {
  it('should be return paper list as select type', (done)=> {
    userSession
      .get('/program/1/papers/selection')
      .query({
        title: 'java',
        page: 1,
        pageCount: 2
      })
      .expect(200)
      .expect((res)=> {
        res.body.data.length.should.equal(2);
      })
      .end(done)
  })
});

describe("Delete /program/1/papers/deletion", ()=> {
    it("should return the paper delete msg", (done)=> {
        userSession
            .delete('/program/1/papers/deletion')
            .send({
                idArray:["5829958a7007c23870a1d681","5829958a7007c23870a1d680"]
            })
            .expect(204)
            .end(done)
    })
});

describe("POST /program/1/papers/distribution", ()=> {
  it("should return distributed paper uri", (done)=> {
    userSession
      .post('/program/1/papers/distribution')
      .send({
        "title": "new title",
        "description": "update paper-api",
        "isDistribution": false,
        "sections": [
          {
            "title": "logicQuizzes",
            "quizzes": {
              "easy": 1,
              "normal": 1,
              "hard": 1
            }
          }, {
            "title": "homeworkQuizzes",
            "quizzes": [{"id": 1, "uri": "/homeworkQuizzes/1"}, {"id": 2, "uri": "/homeworkQuizzes/2"}]
          }
        ]
      })
      .expect(201)
      .end(done)
  })
});
