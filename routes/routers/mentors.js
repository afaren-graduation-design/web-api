var express = require('express');

import MentorsController from '../../controllers/mentors-controller';

var mentorsController = new MentorsController();
var router = express.Router();

router.get('/', mentorsController.search);

module.exports = router;
