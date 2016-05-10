'use strict';

var express = require('express');
var router = express.Router();
var PaperDraftController = require('../../controllers/paper-draft-controller');
var paperDraftController = new PaperDraftController();

router.get('/', paperDraftController.getPaperDefinition);

router.post('/', paperDraftController.createPaperDefinition);

router.post('/:paperHash', paperDraftController.insertLogicPuzzleSection);

module.exports = router;