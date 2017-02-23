var express = require('express');
var router = express.Router();

var StacksController = require('../../controllers/stack-controller');
var stacksController = new StacksController();

router.get('/', stacksController.getStacks);
router.get('/:stackId', stacksController.getStack);
router.post('/', stacksController.create);
router.put('/:stackId', stacksController.update);
router.get('/status/:stackId', stacksController.searchStatus);

module.exports = router;
