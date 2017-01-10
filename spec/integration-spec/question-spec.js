require('./spec-base');
var userSession = global.userSession;


describe('QuestionController', () =>{
  it('should return LogicPuzzle when receive request' , (done) => {
    userSession.get('/questions/5866007d7274f8b8a786d2e0')
        .expect(200)
        .expect((res)=>{
          res.body={
            "item": {
              "id": 25,
              "initializedBox": "[0,2,7,2,1,5,7,1,4,8]",
              "question": "经过以上操作之后，现在2号盒子中的数字是多少?",
              "description": `[\"\",\"更改指令2：将该指令中的第2个盒子的编号加1\",\"相乘：3号盒子中的数字*2号盒子中的数字，将结果放在2号盒子中。\",\"判断：指令2中第2个盒子的编号比6号盒子中的数字大吗\",\"将2号盒子中的数字放在6号盒子中\",\"判断：指令4中第1个盒子的编号比3号盒子中的数字大吗\",\"更改指令2：将该指令中的第1个盒子的编号加2\",\"判断：指令8中第2个盒子的编号比5号盒子中的数字大吗\",\"将6号盒子中的数字放在5号盒子中\",\"更改指令4：将该指令中的第1个盒子的编号加1\",\"\"]`,
              "chartPath": "logic-puzzle/31.png"
            },
            "itemCount": 10
          }
        })
        .end(done);
  });
});