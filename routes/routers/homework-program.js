var express = require('express');
var router = express.Router();

var HomeworkProgramController = require('../../controllers/homework-program-controller');
var homeworkProgramController = new HomeworkProgramController();
console.log('route')
router.get('/', homeworkProgramController.getHomeworkList);

module.exports = router;
