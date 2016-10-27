'use strict';

var express = require('express');
var router = express.Router();
var PaperController = require('../../controllers/paper-controller');

router.get('/:paperHash', PaperController.details);
router.get('/:paperId/obtainment', PaperController.obtain);
router.get('/',PaperController.getLists);
<<<<<<< HEAD
router.put('/:paperId',PaperController.deletePaper);
=======
>>>>>>> 7916dbc420211190424ac18c35bb18cf3ea25c7b
module.exports = router;
