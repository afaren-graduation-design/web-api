'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var PaperController = require('../../controllers/paper-controller');
var paperController = new PaperController();

router.post('/', paperController.operatePaper);

module.exports = router;