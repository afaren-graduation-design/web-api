'use strict';

var UserChannel = require('../models/user-channel.js');
var Channel = require('../models/channel.js');
var async = require('async');
var constant = require('../mixin/constant');


function AdminController() {

}

AdminController.prototype.addChannel = (req,res,next) => {
  var newChannel = new Channel;
  newChannel.name = req.body.name;

  Channel.findOne({name:newChannel.name},(err,link)=>{
    if(err){
      return next(err);
    } else if(!link){
      newChannel.save(function (err, newLink, numAffected) {
        if(err){
          return next(err);
        }
      });
      res.sendStatus(constant.httpCode.OK);
    } else if(link){
      res.send({message: 'Already Exist'});
    }
  });
};

AdminController.prototype.getChannel = (req,res,next) => {
  Channel.find({},(err,links)=>{
    if(err){
      return next(err);
    }
    res.send({links: links});
  });
};

AdminController.prototype.removeChannel = (req, res, next) => {
  var name = req.query.name;
  var _id = req.query._id;

  console.log(name);
  console.log(_id);
  Channel.findOneAndRemove({name:name,_id:_id},(err)=>{
    if(err){
      return next(err);
    }
    res.sendStatus(constant.httpCode.OK);
  });
};



module.exports = AdminController;