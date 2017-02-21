var express = require('express');
var router = express.Router();
var PaperDefinitionController = require('../../controllers/paper-definition-controller');
var ProgramPaperController = require('../../controllers/program-paper-controller');
var paperDefinitionController = new PaperDefinitionController();

var programPaperController = new ProgramPaperController();

router.get('/:programId/paperDefinitions', paperDefinitionController.getPaperDefinitionList);
router.post('/:programId/paperDefinitions', paperDefinitionController.savePaperDefinition);
router.get('/:programId/paperDefinitions/selection', paperDefinitionController.selectPaperDefinition);
router.delete('/:programId/paperDefinitions/deletion', paperDefinitionController.deleteSomePaperDefinition);
router.delete('/:programId/paperDefinitions/:paperId', paperDefinitionController.deletePaperDefinition);
router.get('/:programId/paperDefinitions/:paperId', paperDefinitionController.getPaperDefinition);
router.put('/:programId/paperDefinitions/:paperId', paperDefinitionController.updatePaperDefinition);
router.post('/:programId/paperDefinitions/distribution', paperDefinitionController.distributePaperDefinition);
router.put('/:programId/paperDefinitions/:paperId/:operation', paperDefinitionController.operatePaperDefinitionById);

router.get('/:programId/papers', programPaperController.getPaperList);
router.post('/:programId/papers/:paperId', programPaperController.retrievePaper);
router.get('/:programId/papers/:paperId/sections', programPaperController.getSection);
router.get('/:programId/papers/:paperId/sections/:sectionId/questionIds', programPaperController.getQuestionIds);
module.exports = router;
