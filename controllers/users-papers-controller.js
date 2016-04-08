'use strict';
var UsersPapers = require('../models/users-papers');
var constant = require('../mixin/constant');

function UsersPapersController () {

}

UsersPapersController.prototype.getLinks = (req, res) => {
  UsersPapers.find({},(err,links)=>{
    if(!err){
      res.send({links: links});
    }
  });
};

UsersPapersController.prototype.addLink = (req, res) => {
  var link = new UsersPapers;
  link.phoneNumber = req.body.phoneNumber;
  link.paperName = req.body.paperName;

  UsersPapers.find({phoneNumber:link.phoneNumber,paperName:link.paperName},(err,links)=>{
    if(!links.length){
      link.save((err)=>{
        if(!err){
          res.sendStatus(constant.httpCode.OK);
        }
      });
    } else {
      res.status(constant.httpCode.OK);
      res.send({errorMessage:'Already Exist!'});
    }
  });
};

UsersPapersController.prototype.removeLink = (req, res) => {
  var phoneNumber = req.query.phoneNumber;
  var paperName = req.query.paperName;

  console.log(req.query);

  UsersPapers.findOneAndRemove({phoneNumber:phoneNumber,paperName:paperName},(err)=>{
    if(!err){
      res.sendStatus(constant.httpCode.OK);
    } else {
      res.status(constant.httpCode.OK);
      res.send({errorMessage:'Not Cool!'});
    }
  });
};

module.exports = UsersPapersController;