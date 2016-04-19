'use strict';
var constant = require('../mixin/constant');
var fs = require('fs');

var yamlConfig = require('node-yaml-config');
var config = yamlConfig.load('./config/config.yml');

var async = require('async');
var request = require('superagent');

function QAController () {}

QAController.prototype.loadQAInfo = (req, res, next) => {
  fs.readFile( __dirname + '/../doc/qa.md', function (err, data) {
    if (err && err.errno === -2) {
      fs.writeFileSync(__dirname + '/../doc/qa.md', '');
    }

    res.send({
      QAContent: data ? data.toString() : ''
    });
  });
};

QAController.prototype.updateQAInfo = (req, res, next) => {
  if(!config.QAInfoAddress) {
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
      fs.writeFile( __dirname + '/../doc/qa.md', result.text, done);
    }
  ], (err, doc) => {
    if (err) {
      return next(err);
    }

    res.send({status: constant.httpCode.OK});
  });
};

module.exports = QAController;
