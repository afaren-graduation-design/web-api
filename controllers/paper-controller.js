var apiRequest = require('../services/api-request');
var async = require('async');
var UserPaper = require('../models/user-paper');
var httpStatus = require('../mixin/constant').httpCode;

function details(req, res, next) {
  var paperHash = req.params.paperHash;
  var userId = req.session.user.id;
  var paper = {};
  var doc;
  var paperIndex;
  var error = {};

  async.waterfall([
    (done) => {
      UserPaper.findOne({userId: userId}, done)
    },

    (data, done) => {
      if (!data) {
        done(true, null)
      } else {
        doc = data;
        paper = data.papers.find((paper, index)=> {
          paperIndex = index;
          return paper._id == paperHash;
        });
        done(null, paper);
      }
    },

    (data, done) => {
      if (data.hasOwnProperty('sections') && data.sections.length !== 0) {
        done(null, data);
      } else {
        apiRequest.get('papers/' + data.id, done);
      }
    },

    (data, done) => {
      if (paper.sections.length !== 0) {
        done(null, paper);
      } else {
        var userPaper = new UserPaper({
          userId: userId,
          papers: []
        });
        doc.papers[paperIndex].sections = data.body.sections;

        doc.save(function (err) {
          if (err) {
            error.status = httpStatus.INTERNAL_SERVER_ERROR;
            done(error, null);
          } else {
            done(null, data);
          }
        });
      }
    },
    (data, done) => {
      done(null,null);
    }

  ], (err, data) => {
    if (err === true) {
      res.send({
        status: httpStatus.NOT_FOUND
      });
    } else if (err !== null && err.status === httpStatus) {
      res.send({
        status: httpStatus.INTERNAL_SERVER_ERROR
      });
    } else {
      res.send({
        status: httpStatus.OK
      })
    }
  });
}
module.exports = {
  details: details
};
