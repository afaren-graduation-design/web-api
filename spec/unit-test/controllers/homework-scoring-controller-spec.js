var should = require('should');
var simple = require('simple-mock')

var superagent = require('superagent');
var mongoTools = require('../../support/fixture/mongo-tools');
var HomeworkController = require('../../../controllers/homework-controller');
var noop = function(){};

simple.mock(superagent, 'post');

describe("homework-controller", ()=> {
  var homeworkCtl, req;

  beforeEach((done) => {
    homeworkCtl = new HomeworkController();
    req = {
      session: {user: {id: 123}}
    }
    mongoTools.refresh(done);
  });

  it("createScoring should create a reoced", (done)=> {

    var _resSend = function(data) {
      data.userId.should.equal(123);
      done();
    }

    homeworkCtl.createScroing(req, {send: _resSend}, noop);
  });

  xit("createScoring should request agent", (done)=> {
    var _resSend = function(data) {
      data.userId.should.equal(123);
      done();
    }

    homeworkCtl.createScroing(req, {send: _resSend}, noop);
  });
})
