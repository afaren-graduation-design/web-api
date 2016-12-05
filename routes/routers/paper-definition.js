var express = require('express');
var router = express.Router();
var ProgramPaperController = require('../../controllers/paper-definition-controller');
var programPaperController = new ProgramPaperController();
router.get('/:programId/paperDefinitions', programPaperController.getPaperList);
router.post('/:programId/paperDefinitions', programPaperController.savePaper);

router.get('/:programId/paperDefinitions/selection', programPaperController.selectPaper);
router.delete('/:programId/paperDefinitions/deletion', programPaperController.deleteSomePapers);
router.delete('/:programId/paperDefinitions/:paperId', programPaperController.deletePaper);
router.get('/:programId/paperDefinitions/:paperId', programPaperController.getPaper);
router.put('/:programId/paperDefinitions/:paperId', programPaperController.updatePaper);
router.post('/:programId/paperDefinitions/distribution', programPaperController.distributePaper);
router.put('/:programId/paperDefinitions/:paperId/distribution', programPaperController.distributePaperById);
module.exports = router;
