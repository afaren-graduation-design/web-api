var express = require('express');
var router = express.Router();

var HomeworkProgramController = require('../../controllers/homework-program-controller');
var homeworkProgramController = new HomeworkProgramController();
router.get('/', homeworkProgramController.getHomeworkList);
router.put('/homeworks/:homeworkId', homeworkProgramController.updateHomework);
router.get('/homeworks/:homeworkId', homeworkProgramController.getOneHomework);
router.delete('/homeworks/:homeworkId', homeworkProgramController.deleteHomework);
router.post('/homeworks', homeworkProgramController.insertHomework);

module.exports = router;
