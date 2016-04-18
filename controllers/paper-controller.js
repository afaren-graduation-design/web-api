'use strict';
var apiRequest = require('../services/api-request');
var async = require('async');
var constant = require('../mixin/constant');

function PaperController (){

}

PaperController.prototype.operatePaper = (req, res, next) => {

  console.log('1111111111')
  var paperInfo = {
    paperName: req.body.paperName,
    makerId: req.session.user.id
  };
  console.log("controller controller");


  apiRequest.post('papers', paperInfo, function(err, resp) {
    console.log(paperInfo);
    console.log("=============");


    if (resp === undefined) {
      res.send({
        status: constant.httpCode.INTERNAL_SERVER_ERROR
      });
    } else if(resp.status === constant.httpCode.OK) {
      console.log(resp.body);
      res.send({
        status: constant.httpCode.CREATED,
        paperId: resp.body.paperId
      });
    } else if(resp.status === constant.httpCode.NOT_FOUND) {
      res.send({
        status: constant.httpCode.NOT_FOUND
      });
    } else {
      return next(err);
    }
  });
};

module.exports = PaperController;