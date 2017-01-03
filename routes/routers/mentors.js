var express = require('express');

import MentorsController from '../../controllers/mentors-controller';

var mentorsController = new MentorsController();
var router = express.Router();

router.get('/', mentorsController.search);
router.get('/search', mentorsController.findMentorOfStudent);

module.exports = router;
