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
    var data = Object.assign({}, req.body, {userId: req.session.user.id});

    userHomeworkScoring.create(data, function(err, data) {
      if(err) {return next(err)}
      res.send(data);
    });
  }
};

module.exports = homeworkScoringController;
