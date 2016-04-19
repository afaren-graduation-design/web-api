'use strict';

var express = require('express');
var router = express.Router();

var QAController = require('../../controllers/qa-controller');
var qaController = new QAController();

router.get('/', qaController.loadQAInfo);

router.post('/update', qaController.updateQAInfo);

module.exports = router;