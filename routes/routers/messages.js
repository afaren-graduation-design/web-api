var express = require('express');

import MessagesController from '../../controllers/messages-controller';

var msgController = new MessagesController();
var router = express.Router();

router.post('/', msgController.create);

module.exports = router;
