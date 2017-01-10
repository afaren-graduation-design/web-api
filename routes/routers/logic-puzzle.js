'use strict';

var express = require('express');
var router = express.Router();

var LogicPuzzleController = require('../../controllers/logic-puzzle-controller');
var logicPuzzleController = new LogicPuzzleController();

router.get('/', logicPuzzleController.getLogicPuzzle);

// router.post('/', logicPuzzleController.submitPaper);

router.post('/save', logicPuzzleController.saveAnswer);

router.post('/:sectionId/submition', logicPuzzleController.submitPaper);

module.exports = router;
