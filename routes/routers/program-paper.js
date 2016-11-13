var express = require('express');
var router = express.Router();
var ProgramPaperController = require('../../controllers/program-paper-controller');
var programPaperController = new ProgramPaperController();

router.get('/:programId/paper/:paperId', programPaperController.getPaper);

module.exports = router;
