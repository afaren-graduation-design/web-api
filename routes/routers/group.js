'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var GroupController = require('../../controllers/group-controller');
var groupController = new GroupController();

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname, '../../public/assets', 'group.html'));
});

router.get('/index',groupController.getGroupInfo);

module.exports = router;