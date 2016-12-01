var express = require('express');
var router = express.Router();
var HomeworkProgramController = require('../../controllers/homework-program-controller');
var homeworkProgramController = new HomeworkProgramController();

router.get('/', homeworkProgramController.getHomeworkListByMysql);
router.get('/selection', homeworkProgramController.matchHomeworkByMysql);

module.exports = router;
