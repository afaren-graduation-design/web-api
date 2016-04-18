'use strict';
var userApiRequest = require('../services/user-api-request');
var async = require('async');
var constant = require('../mixin/constant');
var group = require('../models/group');

function GroupController() {

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
  var groupUrl = 'users/' + userId + '/groups';

  userApiRequest.get(groupUrl, function (err, resp) {
    if (resp === undefined) {
      res.send({
        status: constant.httpCode.INTERNAL_SERVER_ERROR
      })
    } else if (resp.status === constant.httpCode.OK) {
      res.send({
        status: constant.httpCode.OK,
        groups: resp.body,
        role: role
      });
    } else if (resp.status === constant.httpCode.NOT_FOUND) {
      res.send({
        status: constant.httpCode.NOT_FOUND,
        role: role
      });
    } else {
      res.status(constant.httpCode.INTERNAL_SERVER_ERROR);
      res.send({
        status: constant.httpCode.INTERNAL_SERVER_ERROR
      });
    }
  });
};

GroupController.prototype.createGroup = (req, res, next) => {

  var demo = new group({groupId: null});

  demo.save((err) => {
    if(err) return next(err);
    res.send({groupHash: demo._id});
  });
};

GroupController.prototype.updateGroupInfo = function (req, res, next) {
  var userId = req.session.user.id;
  var groupId;
  var groupInfo = {
    name: req.body.name,
    avatar: req.body.avatar,
    adminId: userId,
    announcement: req.body.announcement,
    isAnnouncePublished: req.body.isAnnouncePublished
  };
  async.waterfall([
    (done) => {
      userApiRequest.post('groups', groupInfo, done);
    },
    (res,done) => {
      groupId = res.body.uri.split('/')[2];
      group.findOne({_id: req.body.groupHash},done)
    },
    (data, done) => {
      data.groupId = groupId;
      data.save(done)
    }
  ], (err) =>{
    if(err) return next(err);
    res.send({status: constant.httpCode.OK});
  });


};

module.exports = GroupController;