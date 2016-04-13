'use strict';
var userApiRequest = require('../services/user-api-request');
var async = require('async');
var constant = require('../mixin/constant');

function GroupController (){

}

GroupController.prototype.getGroupInfo = (req, res) => {
  var groupId = req.query.groupId;
  userApiRequest.get('groups/' + groupId, (err, data) => {
    if (err) {
      res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
      res.send({status: constant.httpCode.INTERNAL_SERVER_ERROR, message: err.message});
    } else {
      res.send(data.body);
    }
  });
};

GroupController.prototype.loadGroup = (req, res)=> {
  if (req.session.user) {
    var userId = req.session.user.id;
    var groupUrl = 'users/' + userId +'/groups';
    console.log(groupUrl);

    userApiRequest.get(groupUrl, function(err, resp) {
      console.log(resp.body);
      if(resp === undefined) {
        res.send({
          status: constant.httpCode.INTERNAL_SERVER_ERROR
        })
      } else if(resp.status === constant.httpCode.OK) {
        res.send({
          status: constant.httpCode.OK,
          groups: resp.body
        });
      } else if(resp.status === constant.httpCode.NOT_FOUND) {
        res.send({
          status: constant.httpCode.NOT_FOUND
        });
      } else {
        res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
        res.send({
          status: constant.httpCode.INTERNAL_SERVER_ERROR
        });
      }
    });
  }
};

module.exports = GroupController;