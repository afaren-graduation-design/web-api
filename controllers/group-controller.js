'use strict';
var apiRequest = require('../services/api-request');
var async = require('async');

function GroupController (){

}

GroupController.prototype.getGroupInfo = (req, res) => {
  //var userId = req.session.user.id;
  var groupId = req.query.groupId;
  //apiRequest.get('groups',{id:groupId})
};

module.exports = GroupController;