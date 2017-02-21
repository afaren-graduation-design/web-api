const express = require('express');
const router = express.Router();
const PaperDefinitionController = require('../../controllers/paper-definition-controller');
const ProgramPaperController = require('../../controllers/program-paper-controller');
const ProgramController = require('../../controllers/program-controller');
const paperDefinitionController = new PaperDefinitionController();

const programPaperController = new ProgramPaperController();

const programController = new ProgramController();

router.post('/', programController.create);
router.put('/:programId',programController.update)
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
