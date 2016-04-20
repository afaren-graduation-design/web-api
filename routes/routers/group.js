'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var GroupController = require('../../controllers/group-controller');
var groupController = new GroupController();

router.get('/', groupController.loadGroup);

router.get('/info/:groupHash', groupController.getGroupInfo);

router.post('/', groupController.createGroup);

router.put('/:groupHash', groupController.updateGroupInfo);

router.post('/:groupHash/paper', groupController.operatePaper);

module.exports = router;