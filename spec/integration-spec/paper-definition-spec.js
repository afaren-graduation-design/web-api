require('./spec-base');
var userSession = global.userSession;

describe('POST programs/:id/paperDefinitions', ()=> {
  it('should be return a paperId', (done)=> {
    userSession
      .post('/programs/1/paperDefinitions')
      .send({
        data: {
          programId: 1,
          isDistribution: false,
          description: '这是一个描述',
          paperName: '题目',
          sections: [
            {
              title: 'logicQuizzes',
              quizzes: {
                easy: 1,
                normal: 1,
                hard: 1
              },
              type: 'loginQuiz'
            }, {
              title: 'homeworkQuizzes',
              quizzes: [
                {id: 1, uri: '/homeworkQuizzes/1'}, {id: 2, uri: '/homeworkQuizzes/2'}
              ],
              type: 'homeworkQuiz'
            }
          ]
        }
      })
      .expect(201)
      .end(done);
  })
});

describe('GET programs/:programId/paperDefinitions/:paperId', ()=> {
  it('should be return a paper: GET  programs/:programId/paperDefinitions/:paperId', (done)=> {
    userSession
      .get('/programs/1/paperDefinitions/5829958a7007c23870a1d68a')
      .expect(200)
      .expect(function (res) {
        res.body.programId.should.equal(1);
        res.body.sections[0].title.should.equal("逻辑题");
        res.body.sections[1].title.should.equal("编程题");
      })
      .end(done);
  })
});

describe('PUT programs/:id/paperDefinitions/:id', ()=> {
  it('should be return a paperId', (done)=> {
    userSession
      .put('/programs/1/paperDefinitions/5829958a7007c23870a1d68a')
      .send({data: {
        paperName: "new title",
        description: "update paper-api",
        sections: [
          {
            title: "logicQuizzes",
            quizzes: {
              easy: 1,
              normal: 1,
              hard: 1
            },
            type: 'loginQuiz'
          }, {
            title: "homeworkQuizzes",
            quizzes: [{id: 1, uri: '/homeworkQuizzes/1'}, {id: 2, uri: '/homeworkQuizzes/2'}],
            type: 'homeworkQUiz'
          }
        ]
      }})
      .expect(204)
      .end(done);
  })
});

describe('POST programs/:id/paperDefinitions', ()=> {
  it('should be return a paperId', (done)=> {
    userSession
      .post('/programs/1/paperDefinitions')
      .send({data: {
        programId: 1,
        isDistribution: false,
        description: '这是一个描述',
        paperName: '题目',
        sections: [
          {
            title: 'logicQuizzes',
            quizzes: {
              easy: 1,
              normal: 1,
              hard: 1
            },
            type: 'loginQuiz'
          }, {
            title: 'homeworkQuizzes',
            quizzes: [
              {id: 1, uri: '/homeworkQuizzes/1'}, {id: 2, uri: '/homeworkQuizzes/2'}
            ],
            type: 'homeworkQuiz'
          }
        ]
      }})
      .expect(201)
      .end(done);
  })
});

describe("GET programs/:programId/paperDefinitions", ()=> {
  it('should be return paper list', (done)=> {
    userSession
      .get('/programs/1/paperDefinitions')
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
describe('DELETE programs/:id/paperDefinitions/:id', ()=> {
  it('should be return a httpCode', (done)=> {
    userSession
      .delete('/programs/1/paperDefinitions/5829958a7007c23870a1d68a')
      .expect(204)
      .end(done);
  })
});

describe("GET programs/:programId/paperDefinitions/selection", ()=> {
  it('should be return paper list as select type', (done)=> {
    userSession
      .get('/programs/1/paperDefinitions/selection')
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

describe("Delete /programs/1/paperDefinitions/deletion", ()=> {
  it("should return the paper delete msg", (done)=> {
    userSession
      .delete('/programs/1/paperDefinitions/deletion')
      .send({
        idArray: ["5829958a7007c23870a1d681", "5829958a7007c23870a1d680"]
      })
      .expect(204)
      .end(done)
  })
});

describe("POST /programs/1/paperDefinitions/distribution", ()=> {
  it("should return distributed paper uri", (done)=> {
    userSession
      .post('/programs/1/paperDefinitions/distribution')
      .send({data: {
        paperName: "new title",
        description: "update paper-api",
        sections: [
          {
            title: "logicQuizzes",
            quizzes: {
              easy: 1,
              normal: 1,
              hard: 1
            },
            type: 'loginQuiz'
          }, {
            title: "homeworkQuizzes",
            quizzes: [{id: 1, uri: "/homeworkQuizzes/1"}, {id: 2, uri: "/homeworkQuizzes/2"}],
            type: 'homeworkQuiz'
          }
        ]
      }})
      .expect(201)
      .end(done)
  })
});

describe("PUT /programs/1/paperDefinitions/:paperId/distribution", ()=> {
  it("should return distributed paper uri", (done)=> {
    userSession
      .put('/programs/1/paperDefinitions/5829958a7007c23870a1d68a/distribution')
      .send({data: {
        paperName: "new title",
        description: "update paper-api",
        sections: [
          {
            title: "logicQuizzes",
            quizzes: {
              easy: 1,
              normal: 1,
              hard: 1
            },
            type: 'loginQuiz'
          }, {
            title: "homeworkQuizzes",
            quizzes: [{id: 1, uri: "/homeworkQuizzes/1"}, {id: 2, uri: "/homeworkQuizzes/2"}],
            type: 'homeworkQuiz'
          }
        ]
      }})
      .expect(201)
      .end(done)
  })
});

