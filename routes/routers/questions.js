const express = require('express');
const router = express.Router();
const QuestionController = require('../../controllers/question-controller');
const questionController = new QuestionController();

router.get('/:questionId', questionController.getQuestion);

module.exports = router;

