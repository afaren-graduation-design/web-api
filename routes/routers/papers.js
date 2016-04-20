'use strict';

var express = require('express');
var router = express.Router();
var PaperController = require('../../controllers/paper-controller');

router.get('/:paperId', PaperController.findOne);

module.exports = router;
