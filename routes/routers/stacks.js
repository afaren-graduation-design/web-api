var express = require('express');
var router = express.Router();

var StacksController = require('../../controllers/stakcs-controller');
var stacksController = new StacksController();

router.get('/', stacksController.getStacks);

module.exports = router;
