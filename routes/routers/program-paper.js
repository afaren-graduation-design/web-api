var express = require('express');
var router = express.Router();
var ProgramPaperController = require('../../controllers/program-paper-controller');
var programPaperController = new ProgramPaperController();

router.get('/:programId/paper/:paperId', programPaperController.getPaper);
router.post('/:programId/papers', programPaperController.savePaper);
router.put('/:programId/paper/:paperId', programPaperController.updatePaper);
router.get('/:programId/papers',programPaperController.getPaperList);

module.exports = router;
