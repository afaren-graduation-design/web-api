var express = require('express');
var router = express.Router();
console.log("HomeworkProgramController");
var HomeworkProgramController = require('../../controllers/homework-program-controller');
var homeworkProgramController = new HomeworkProgramController();
router.get('/search', homeworkProgramController.matchHomework);

router.get('/', homeworkProgramController.getHomeworkList);
router.put('/:homeworkId', homeworkProgramController.updateHomework);
router.get('/:homeworkId', homeworkProgramController.getOneHomework);
router.delete('/:homeworkId', homeworkProgramController.deleteHomework);
router.post('/', homeworkProgramController.insertHomework);

module.exports = router;
