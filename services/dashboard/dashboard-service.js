var logicPuzzle = require('../../models/logic-puzzle');
var userHomeworkQuizzes = require('../../models/user-homework-quizzes');
var constant = require('../../mixin/constant');
var async = require('async');
var deadline = 7;

function getLogicPuzzleStatus(userId){
  return !logicPuzzle.isPaperCommited(userId);
}

function getHomeworkQuizStatus(userId) {
  var status = false;   //模块不可访问
  async.waterfall([
    (done)=>{
      userHomeworkQuizzes.findOne({userId:userId}).exec((err,data)=>{done(err,data)})
    },
    (data,done)=>{
      var quizzes = data.toJSON().quizzes;
      console.log(JSON.stringify(quizzes) + 'quizzes' + typeof quizzes +"\n")
      status = quizzes.every((item)=> {
        return item.status === 4
        })  || quizzes.filter((item,index)=>{
        return index > 0;
        }).every(item=>(item.status === 1)) && !quizzes[0].startTime
      console.log("status****"+status+data.toString());
      done(status,data);
    },
    (data,done)=>{
      var currentQuiz = data.toJSON().quizzes.filter((item)=>{
        return item.status !== 1 && item.status !== 4
      })[0];
      var currentTime = parseInt(new Date().getTime()) /
        (constant.time.SECONDS_PER_MINUTE *
        constant.time.MINUTE_PER_HOUR *
        constant.time.HOURS_PER_DAY *
        constant.time.MILLISECOND_PER_SECONDS);
      var startTime = parseInt(currentQuiz.startTime) /
        (constant.time.SECONDS_PER_MINUTE *
        constant.time.MINUTE_PER_HOUR *
        constant.time.HOURS_PER_DAY);
      status = currentTime - startTime > deadline;
      console.log()
      done(status,data)
    }
  ],(err,status)=>{
    if(err){
      console.log('完了'+err)
      return false;
    } else {
      return true;
    }
  })
}

module.exports = {
  getHomeworkQuizStatus:getHomeworkQuizStatus,
  getLogicPuzzleStatus:getLogicPuzzleStatus
};
