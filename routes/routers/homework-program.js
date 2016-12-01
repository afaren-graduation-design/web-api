var express = require('express');
var router = express.Router();
var homeworkProgramController = require('../../controllers/homework-program-controller');
var homeworkProgramController = new homeworkProgramController();

router.get('/', homeworkProgramController.getHomeworkListByMysql);
router.get('/selection', homeworkProgramController.matchHomeworkByMysql);

module.exports = router;