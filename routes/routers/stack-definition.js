var express = require('express');
var router = express.Router();

var StackDefinitionController = require('../../controllers/stack-definiton-controller');
var stackDefinitonCtrl = new StackDefinitionController();

router.get('/', stackDefinitonCtrl.getAll);
router.get('/:stackId', stackDefinitonCtrl.getOne);
router.post('/', stackDefinitonCtrl.create);
router.put('/:stackId', stackDefinitonCtrl.update);
router.get('/status/:stackId', stackDefinitonCtrl.searchStatus);

module.exports = router;
