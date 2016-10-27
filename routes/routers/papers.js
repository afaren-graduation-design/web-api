'use strict';

var express = require('express');
var router = express.Router();
var PaperController = require('../../controllers/paper-controller');

router.get('/:paperHash', PaperController.details);
router.get('/:paperId/obtainment', PaperController.obtain);
router.get('/',PaperController.getLists);
<<<<<<< HEAD
router.put('/',PaperController.modifyPaperMeta);

=======
<<<<<<< HEAD
router.put('/', PaperController.putPaperMeta);
=======
router.put('/:paperId',PaperController.deletePaper);
router.put('/', PaperController.putPaperMeta);

>>>>>>> 3a7bc88
>>>>>>> refs/remotes/origin/master
module.exports = router;
