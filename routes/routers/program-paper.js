var express = require('express');
var router = express.Router();
var ProgramPaperController = require('../../controllers/program-paper-controller');
var programPaperController = new ProgramPaperController();
router.get('/:programId/papers', programPaperController.getPaperList);
router.post('/:programId/papers', programPaperController.savePaper);

router.get('/:programId/papers/selection',programPaperController.selectPaper);
router.delete('/:programId/papers/deletion',programPaperController.deleteSomePapers);
router.delete('/:programId/paper/:paperId', programPaperController.deletePaper);
router.get('/:programId/paper/:paperId', programPaperController.getPaper);
router.put('/:programId/paper/:paperId', programPaperController.updatePaper);
router.put('/:programId/paper/:paperId/distribution', programPaperController.distributionPaper);
router.delete('/:programId/papers', programPaperController.deleteBatch);

module.exports = router;
