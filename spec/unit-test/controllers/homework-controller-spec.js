
var should = require('should');
var mongoTools = require('../../support/fixture/mongo-tools');
var HomeworkController = require('../../../controllers/homework-controller');
var noop = function(){};

describe("homework-controller", ()=> {
  var homeworkCtl;


  beforeEach((done) => {
    homeworkCtl = new HomeworkController();
    mongoTools.refresh(done);
  });

  it("createScoring", (done)=> {
    var req = {
      session: {user: {id: 123}}
    }

    var _resSend = function(data) {
      console.log(data);
      data.userId.should.equal(123);
      done();
    }

    homeworkCtl.createScroing(req, {send: _resSend}, noop);
  });
})
