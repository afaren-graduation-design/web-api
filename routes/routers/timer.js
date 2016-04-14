'use strict';

var express = require('express');
var router = express.Router();
var constant = require('../../mixin/constant');
var _timeBase = 90;
var logicPuzzle = require('../../models/logic-puzzle');
var async = require('async');

router.get('/remain-time', function (req, res) {
  var TOTAL_TIME = _timeBase * constant.time.SECONDS_PER_MINUTE;
  var userId = req.session.user ? req.session.user.id : 'invalid';
  var sectionId = req.query.sectionId || 1;
  var startTime;
  var thisSection;

  async.waterfall([
    (done) => {
      if(userId === 'invalid'){
        done(true);
      }else {
        logicPuzzle.findOne({userId: userId}, done);
      }
    },
    (logicPuzzle, done) => {
      if (logicPuzzle && logicPuzzle.sections.length === 0) {

        startTime = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;

        logicPuzzle.sections.push({
          startTime: startTime,
          sectionId: sectionId
        });

        logicPuzzle.save(done);
      } else if(logicPuzzle && logicPuzzle.sections.length !== 0){

        thisSection = logicPuzzle.sections.find((section)=>{
          return section.sectionId === parseInt(sectionId);
        });

        if(thisSection){
          done(null, logicPuzzle, true);
        } else {
          startTime = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;

          logicPuzzle.sections.push({
            startTime: startTime,
            sectionId: sectionId
          });

          logicPuzzle.save(done);
        }
      } else {
        done(null, logicPuzzle, true);
      }
    },
    (logicPuzzle, affectNum, done) => {
      var now = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
      var usedTime = now - (startTime || thisSection.startTime);

      done(null, parseInt((TOTAL_TIME - usedTime)));
    }
  ], (err, remainTime) => {
    if (err) {
      res.sendStatus(constant.httpCode.INTERNAL_SERVER_ERROR);
    }else {
      res.send({
        remainTime: remainTime
      });
    }
  });
});

module.exports = router;