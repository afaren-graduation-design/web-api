'use strict';
var userApiRequest = require('../services/user-api-request');
var async = require('async');
var constant = require('../mixin/constant');

function GroupController (){

}

GroupController.prototype.getGroupInfo = (req, res) => {
  var groupId = req.query.groupId;
  userApiRequest.get('groups/' + groupId, (err, data) => {
    if(err){
      res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
      res.send({status: constant.httpCode.INTERNAL_SERVER_ERROR, message: err.message});
    }else {
      res.send(data.body);
    }
  });
};

module.exports = GroupController;