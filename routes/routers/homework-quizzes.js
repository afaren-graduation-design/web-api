var express = require('express');
var router = express.Router();

var HomeworkQuizzesController = require('../../controllers/homework-quizzes-controller');
var homeworkQuizzesController = new HomeworkQuizzesController();

router.get('/:id', homeworkQuizzesController.getOneHomework);
router.get('/', homeworkQuizzesController.getStacks);

module.exports = router;
