var express = require('express');

import MessagesController from '../../controllers/messages-controller';

var msgController = new MessagesController();
var router = express.Router();
router.post('/', msgController.create);
router.get('/', msgController.find);
router.post('/:messageId/:operation', msgController.operateMessage);

module.exports = router;
