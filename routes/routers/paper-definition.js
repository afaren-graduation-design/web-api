'use strict';

var express = require('express');
var router = express.Router();
var PaperDefinitionController = require('../../controllers/paper-definition-controller');
var paperDefinitionController = new PaperDefinitionController();

router.get('/', paperDefinitionController.getPaperDefinition);

router.post('/', paperDefinitionController.createPaperDefinition);

module.exports = router;