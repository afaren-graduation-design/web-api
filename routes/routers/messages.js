var express = require('express');

import MessagesController from '../../controllers/messages-controller';

var msgController = new MessagesController();
var router = express.Router();

router.post('/', msgController.create);
router.get('/', msgController.search);
router.get('/unread', msgController.findUnread);
router.put('/:messageId/:operation', msgController.update);

module.exports = router;
