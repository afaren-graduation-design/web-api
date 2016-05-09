var async = require('async');
var fs = require('fs');
var request = require('superagent');
var userHomeworkScoring = require('../models/homework-scoring');

var homeworkScoringController = {
  getScoring: function(req, res, next) {
    userHomeworkScoring.find({
      userId: req.session.user.id
    }, (err, data)=> {
      if(err) {return next(err)}
      res.send(data);
    })
  },

  createScoring: function(req, res, next) {
    async.waterfall([

      function(done) {
        var data = Object.assign({}, req.body, {userId: req.session.user.id});
        userHomeworkScoring.create(data, done);
      },

      function(data, done) {
        fs.readFile('/Users/wjlin/Downloads/test.sh', 'utf8', done);
      },

      function(data, done) {
        var script = data.split('\n').join('\\n')
        // var script = data;
        // var script = encodeURIComponent(data);
        // console.log(script);
        var long_data = "";
        for(var i=0; i<5000; i++) {
          long_data += i;
        }
        long_data += "我";

        var createJobStr = 'http://192.168.99.100:8088/job/HOMEWORK-SCORING/buildWithParameters';
        request
          .post(createJobStr)
          .auth('twars', 'twars')
          .type('form')
          .send({
            script: script,
            long_data: long_data
          })
          .end(done);
      }

    ], function(err, data) {
      if(err) {return next(err)}
      res.status(201).send(data);
    })
  },

  updateScoring: function(req, res, next) {
    userHomeworkScoring.update(req.params.id, req.body, function(err, data) {
      if(err) {return next(err);}
      res.send(data);
    });
  }
};

module.exports = homeworkScoringController;
