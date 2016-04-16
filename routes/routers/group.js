'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var GroupController = require('../../controllers/group-controller');
var groupController = new GroupController();

router.get('/', groupController.loadGroup);

router.get('/info',groupController.getGroupInfo);

router.post('/', groupController.createGroup);

router.put('/', groupController.updateGroupInfo);

module.exports = router;