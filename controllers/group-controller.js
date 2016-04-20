'use strict';
var userApiRequest = require('../services/user-api-request');
var async = require('async');
var constant = require('../mixin/constant');
var group = require('../models/group');

function GroupController() {

}

GroupController.prototype.getGroupInfo = (req, res, next) => {
  var groupHash = req.params.groupHash;
  var groupId;

  async.waterfall([
    (done)=> {
      group.findOne({_id: groupHash}, done);

    }, (data, done)=> {
      groupId = data.groupId;
      userApiRequest.get('groups/' + groupId, done);

    }], (err, data)=> {

    if (err) {
      return next(err);
    } else {
      res.send(data.body);
    }
  });
};


function getGroupHashByGroupId(groupList, groupId) {
  return groupList.find((item)=> {
    return item.groupId === groupId;
  })._id;
}

GroupController.prototype.loadGroup = (req, res, next)=> {
  var userId = req.session.user.id;
  var role = req.session.user.role;
  var groupUrl = 'users/' + userId + '/groups';
  var newGroupList;

  async.waterfall([
    (done)=> {
      userApiRequest.get(groupUrl, done);
    }, (resp, done)=> {
      if (resp.status === constant.httpCode.OK) {
        var groupList;

        group.find({}, (err, data)=> {
          groupList = data;
          newGroupList = resp.body.map((item)=> {
            var groupId = item.id;
            var groupHash = getGroupHashByGroupId(groupList, groupId);
            return Object.assign({}, item, {groupHash: groupHash});
          });
          done(null, resp);
        });
      } else {
        done(null, resp);
      }
    }
  ], (err, data)=> {
    if (err) return next(err);

    if (data.status === constant.httpCode.OK) {
      res.send({
        status: constant.httpCode.OK,
        groups: newGroupList,
        role: role
      });
    }

    if (data.status === constant.httpCode.NOT_FOUND) {
      res.send({
        status: constant.httpCode.NOT_FOUND,
        role: role
      });
    }

  });
};

GroupController.prototype.createGroup = (req, res, next) => {

  var demo = new group({groupId: null});

  demo.save((err) => {
    if (err) return next(err);
    res.send({groupHash: demo._id});
  });
};

GroupController.prototype.updateGroupInfo = function (req, res, next) {
  var groupHash = req.params.groupHash;

  async.waterfall([
    (done) => {
      group.findOne({_id: groupHash}, done)
    },
    (data, done) => {

      var groupId = data.groupId;
      var url = 'groups/' + groupId;

      userApiRequest.put(url, req.body, done);
    }
  ], (err, data) => {
    if (err) return next(err);
    res.send({status: data.body.status});
  });
};


GroupController.prototype.operatePaper = (req, res, next) => {

  var paperInfo = {
    paperName: req.body.paperName,
    makerId: req.session.user.id
  };

  apiRequest.post('papers', paperInfo, function(err, resp) {

    if (resp === undefined) {
      res.send({
        status: constant.httpCode.INTERNAL_SERVER_ERROR
      });
    } else if(resp.status === constant.httpCode.OK) {
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

module.exports = GroupController;