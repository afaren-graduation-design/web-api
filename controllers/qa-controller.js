'use strict';
var constant = require('../mixin/constant');
var Configuration = require('../models/configuration');

var yamlConfig = require('node-yaml-config');
var config = yamlConfig.load('./config/config.yml');

var async = require('async');
var request = require('superagent');

function QAController() {
}

QAController.prototype.loadQAInfo = (req, res, next) => {
  Configuration.findOne({}, (err, configuration)=> {
    if (err) {
      return next(err);
    }
    if(configuration){
      res.send({
        QAContent: configuration.qaContent ? configuration.qaContent : ''
      });
    } else {
      res.send({
        QAContent: ''
      });
    }
  });
};

QAController.prototype.updateQAInfo = (req, res, next) => {
  if (!config.QAInfoAddress) {
    return res.send({status: constant.httpCode.NOT_FOUND});
  }

  async.waterfall([
    (done) => {
      request
          .get(config.QAInfoAddress)
          .set('Content-Type', 'application/json')
          .end(done);
    },

    (result, done) => {
      Configuration.findOne({}, (err, configuration)=> {
        if (err) {
          return next(err);
        }
        configuration.qaContent = result.text;
        configuration.save(done);
      });
    }
  ], (err) => {
    if (err) {
      return next(err);
    }

    res.send({status: constant.httpCode.OK});
  });
};

module.exports = QAController;
