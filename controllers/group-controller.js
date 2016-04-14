'use strict';
var userApiRequest = require('../services/user-api-request');
var async = require('async');
var constant = require('../mixin/constant');
var userGroup = require('../models/user-group');

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
    var userId = req.session.user.id;
    var role = req.session.user.role;
    var groupUrl = 'users/' + userId +'/groups';

    userApiRequest.get(groupUrl, function(err, resp) {
      if(resp === undefined) {
        res.send({
          status: constant.httpCode.INTERNAL_SERVER_ERROR
        })
      } else if(resp.status === constant.httpCode.OK) {
        res.send({
          status: constant.httpCode.OK,
          groups: resp.body,
          role: role
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
};

GroupController.prototype.createGroup = (req, res) => {
  var userId = req.session.user.id;
  var groupHash;
  async.waterfall([
    (done) => {
      userGroup.findOne({userId: userId},done);
    },
    (data, done) => {
      if(!data){
        var demo = new userGroup({
          userId: userId,
          groups: [
            {groupId: 1}
          ]
        });
        demo.save();
      }else {
        data.groups.push({groupId: data.groups.length + 1});
        data.save();
      }
      done(null,data);
    },
    (data,done) => {
      groupHash = data.groups[data.groups.length - 1]._id;
      done(null,groupHash);
    }
  ],(err, result) => {
    if(err){
      res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
      res.send({
        status: constant.httpCode.INTERNAL_SERVER_ERROR
      });
    }else {
      res.send({
        status: constant.httpCode.OK,
        groupHash: groupHash
      });
    }
  });
};

module.exports = GroupController;