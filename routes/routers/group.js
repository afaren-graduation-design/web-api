'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var GroupController = require('../../controllers/group-controller');
var groupController = new GroupController();

var PaperController = require('../../controllers/paper-controller');
var paperController = new PaperController();

router.get('/', groupController.loadGroup);

router.get('/info/:groupHash', groupController.getGroupInfo);

router.post('/', groupController.createGroup);

router.put('/:groupHash', groupController.updateGroupInfo);

router.post('/:groupHash/paper', paperController.operatePaper);

module.exports = router;