require('./spec-base');
var userSession = global.userSession;

describe("GET homeworks",()=>{
    it.only('should be return homeworks list',(done)=>{
        userSession
            .get('/homeworks')
            .query({
                page:1,
                pageCount:3
            })
            .expect(200)
            .expect((res)=>{
                res.body.length.should.equal(3);
            })
            .end(done)
    })
});
