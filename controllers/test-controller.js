'use strict';

var apiRequest = require('../services/api-request');
var constant = require('../mixin/constant');

function TestController() {

}
TestController.prototype.isDetailed = (req, res) => {
  var userId = req.session.user.id;
  var uri = 'users/' + userId + '/detail';

  apiRequest.get(uri, function(err, resp) {
    if(resp === undefined) {
      res.send({
        status: constant.httpCode.INTERNAL_SERVER_ERROR
      });
    }else if(resp.status === constant.httpCode.OK) {
      res.send({
        data: false
      });
    }else if(resp.status === constant.httpCode.NOT_FOUND) {
      res.send({
        data: true
      })
    } else {
      res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
      res.send({
        status: constant.httpCode.INTERNAL_SERVER_ERROR
      });
    }
  })

};

module.exports = TestController;